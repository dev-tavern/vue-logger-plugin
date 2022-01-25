# vue-logger-plugin

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![codecov][codecov-image]][codecov-url]
[![circleci][circleci-image]][circleci-url]
![minified][minified-image]
![minzipped][minzipped-image]

> Flexible logging functionality for Vue.js with support for custom hook operations.

Contents
=================
* [NPM Package Install](#npm-package-install)
* [Vue Plugin Install](#vue-plugin-install)
* [Options](#options)
* [Hooks](#hooks)
    * [Built-in Hooks](#built-in-hooks)
    * [Write Your Own Hooks](#write-your-own-hooks)
* [Usage](#usage)
* [License](#license)
* [Changelog](CHANGELOG.md)

## NPM Package Install

```sh
npm i vue-logger-plugin@1.x-latest
```

## Vue Plugin Install

The logging implementation can be installed a couple different ways, either by providing options or a constructed VueLogger instance to ```Vue.use```.  

Here is the simplest usage:

**`main.js`**
```js
import VueLogger from 'vue-logger-plugin'
Vue.use(VueLogger, { <options here> })
// or simply Vue.use(VueLogger) to just use the default options
```

For advanced usage (i.e. using conditional options and hooks), it is recommended to export the constructed logger implementation in a separate file and then import into your main file.

**`logger/index.js`**
```js
import VueLogger from 'vue-logger-plugin'

// define options
const options = {
  enabled: true,
  level: 'debug',
  beforeHooks: [ ... ],
  afterHooks: [ ... ]
}

// export logger with applied options
export default new VueLogger(options)
```
**`main.js`**
```js
import logger from './logger'
Vue.use(logger)
// note that you may also provide the options argument here as well
// if provided, they would be merged with / override the options already applied
```

More information about hooks can be found in the [Hooks](#Hooks) section.

### Options

**Name**|**Type**|**Default**|**Description**
:-----|:-----|:-----|:-----
enabled | boolean | true | enable/disable logger
consoleEnabled | boolean | true | enable/disable console output
level | string | 'debug' | the logging level (one of: debug, info, warn, error, log)
beforeHooks | LoggerHook[] | [] | hooks invoked before a statement is logged, can be used to alter log arguments (use carefully)
afterHooks | LoggerHook[] | [] | hooks invoked after a statement is logged

**Levels**

log <-- error <-- warn <-- info <-- debug

_(from left to right: least inclusive to most inclusive)_

Specify an appropriate level to limit the amount of information logged.  For example, using the 'warn' level will log the 'log', 'error', and 'warn' events but not the 'info' or 'debug' events.

> Note: Depending on your browser, the debug level may be labeled as "Verbose" instead of "Debug".  Ensure this level is enabled if looking for debug logs in the browser console.  Chrome uses verbose for these logs, see docs [here](https://developer.chrome.com/docs/devtools/console/log/#browser).

**enabled vs consoleEnabled**

Setting `enabled` to false will disable all logger functionality (console output + hook invocations).

Setting `consoleEnabled` to false will disable just the console output but will still invoke the hooks.

So, for example, if you want to prevent writing logs to the browser console but still invoke a hook (i.e. to send logs to a server) then you would set `enabled: true` and `consoleEnabled: false`.

### Hooks

Hooks allow for advanced customization of the logger implementation, providing operations to be run before and after logging is performed.  These are defined on options as ```beforeHooks``` and ```afterHooks```.

##### beforeHooks
Invoked before a statement is logged, can alter the log arguments which can impact the log output.

##### afterHooks
Invoked after a statement is logged, cannot impact the log output.

#### Built-in Hooks
The following hooks are available in this package and can be used by simply importing and adding them to the beforeHooks and/or afterHooks arrays of your options.

**`StringifyObjectsHook`**
Applies JSON.stringify on all objects provided as arguments to a logging method.
```js
import { StringifyObjectsHook } from 'vue-logger-plugin'
const options = {
  // ... (other options)
  beforeHooks: [
    StringifyObjectsHook
  ]
}
```
**`StringifyAndParseObjectsHook`**
Applies JSON.stringify and JSON.parse on all objects provided as arguments to a logging method.
```js
import { StringifyAndParseObjectsHook } from 'vue-logger-plugin'
const options = {
  // ... (other options)
  beforeHooks: [
    StringifyAndParseObjectsHook
  ]
}
```

The above are best used as 'before hooks' as they may purposefully alter the log output.  This way you are sure you are seeing the value of an object at the moment you log it. Otherwise, many browsers provide a live view that constantly updates as values change.

#### Write Your Own Hooks

You can easily write your own hooks to apply custom logic.  A hook must implement a ```run``` function to handle a log event (an object containing the log level and the array of arguments which were passed to the logging method), and may optionally implement an ```install``` function which is invoked during plugin installation (or at the time of logger options application - see [Usage](#usage) section).

For reference, here are the interfaces:
```ts
export interface LoggerHook {
  run (event: LogEvent): void
  install? (options: LoggerOptions): void
  props?: { [key: string]: any }
}
export interface LogEvent {
  level: string
  argumentArray: any[]
}
```

##### Sample Custom Hook - Leveraging Axios to Send Logs to Server
This is a basic example demonstrating how you could have the logger send log data to a server using an Axios client.

**`logger/index.js`**
```js
import VueLogger from 'vue-logger-plugin'
import axios from 'axios'

const ServerLogHook = {
  run (event) {
    axios.post('/log', { severity: event.level, data: event.argumentArray })
  }
}

const options = {
  // ... (other options)
  afterHooks: [
    ServerLogHook
  ]
}

export default new VueLogger(options)
```
**`logger/index.ts`** (TypeScript example, same functionality as above)
```ts
import VueLogger, { LoggerOptions, LoggerHook, LogEvent } from 'vue-logger-plugin'
import axios from 'axios'

const ServerLogHook: LoggerHook = {
  run (event: LogEvent) {
    axios.post('/log', { severity: event.level, data: event.argumentArray })
  }
}

const options: LoggerOptions = {
  // ... (other options)
  afterHooks: [
    ServerLogHook
  ]
}

export default new VueLogger(options)
```

## Usage

Once installed, the logger is available within the Vue instance via both ```$log``` and ```$logger``` (both access the same logger instance and provide the same functionality).

```js
new Vue({
  created: function() {
    const testObject = {
      name: 'test',
      value: 'this is a test object'
    }
    // using $log
    this.$log.debug('Test Message', testObject)
    this.$log.info('Test Message', testObject)
    this.$log.warn('Test Message', testObject)
    this.$log.error('Test Message', testObject)
    this.$log.log('Test Message', testObject)
    // using $logger
    this.$logger.debug('Test Message', testObject)
    this.$logger.info('Test Message', testObject)
    this.$logger.warn('Test Message', testObject)
    this.$logger.error('Test Message', testObject)
    this.$logger.log('Test Message', testObject)
  }
})
```

As described in the Vue Plugin Install section above, options can be provided to the VueLogger constructor and/or to the Vue.use method for customizing the logging implementation.  As well, options can be applied at any time to the logger on the Vue instance via the ```apply``` method.  This allows for on-demand enabling/disabling of the logger and adjusting log levels as needed from within your components.

```js
this.$log.apply({ level: 'info' }) // applies log level
```

```js
this.$log.apply({ enabled: false }) // disables logging
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[npm-image]: https://img.shields.io/npm/v/vue-logger-plugin/1.x-latest.svg
[npm-url]: https://npmjs.org/package/vue-logger-plugin
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[codecov-image]: https://codecov.io/gh/dev-tavern/vue-logger-plugin/branch/develop-v1/graph/badge.svg?token=WZDGBNBIW5
[codecov-url]: https://codecov.io/gh/dev-tavern/vue-logger-plugin
[circleci-image]: https://circleci.com/gh/dev-tavern/vue-logger-plugin/tree/develop-v1.svg?style=svg
[circleci-url]: https://circleci.com/gh/dev-tavern/vue-logger-plugin?branch=develop-v1
[minified-image]: https://badgen.net/bundlephobia/min/vue-logger-plugin@1.x-latest
[minzipped-image]: https://badgen.net/bundlephobia/minzip/vue-logger-plugin@1.x-latest