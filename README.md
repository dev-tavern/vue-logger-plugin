# vue-logger-plugin

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![codecov][codecov-image]][codecov-url]
[![circleci][circleci-image]][circleci-url]
![minified][minified-image]
![minzipped][minzipped-image]

> Flexible logging functionality for Vue.js with support for custom hook operations.

*Note:*
*Versions 2.x support Vue 3 and versions 1.x support Vue 2.*
*For documentation related to Vue 2, view a 1.x tag*

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
npm i vue-logger-plugin
```

## Vue Plugin Install

The logging implementation can be installed by creating a logger instance using ```createlogger``` and providing that logger instance to the Vue ```App.use``` method.  

Here is the simplest usage:

**`main.js`**
```js
import { createApp } from 'vue';
import { createLogger } from 'vue-logger-plugin'
import App from './App.vue'
createApp(App)
  .use(createLogger())
  .mount('#app')
```

Doing the above will install the logger with the basic default options.

For advanced usage (i.e. using conditional options and hooks), it is recommended to export the constructed logger instance in a separate file and then import into your main file.

**`logger/index.js`**
```js
import { createLogger } from 'vue-logger-plugin'

// create logger with options
const logger = createLogger({
  enabled: true,
  level: 'debug',
  beforeHooks: [ ... ],
  afterHooks: [ ... ]
})

export default logger
```
**`main.js`**
```js
import { createApp } from 'vue'
import App from './App.vue'
import logger from './logger'
createApp(App)
  .use(logger)
  .mount('#app')
```

More information about hooks can be found in the [Hooks](#Hooks) section.

## Options

**Name**|**Type**|**Default**|**Description**
:-----|:-----|:-----|:-----
enabled | boolean | true | enable/disable logger
consoleEnabled | boolean | true | enable/disable console output
level | string | 'debug' | the logging level (one of: debug, info, warn, error, log)
callerInfo | boolean | false | whether information about the caller function should be included
prefixFormat | string | *(see [below](#prefixFormat))* | provide a custom formatted string for the log message prefix (preceeds the log arguments)
beforeHooks | LoggerHook[] | [] | hooks invoked before a statement is logged, can be used to alter log arguments (use carefully)
afterHooks | LoggerHook[] | [] | hooks invoked after a statement is logged

### **Levels**

log <-- error <-- warn <-- info <-- debug

_(from left to right: least inclusive to most inclusive)_

Specify an appropriate level to limit the amount of information logged.  For example, using the 'warn' level will log the 'log', 'error', and 'warn' events but not the 'info' or 'debug' events.

> Note: Depending on your browser, the debug level may be labeled as "Verbose" instead of "Debug".  Ensure this level is enabled if looking for debug logs in the browser console.  Chrome uses verbose for these logs, see docs [here](https://developer.chrome.com/docs/devtools/console/log/#browser).

### **enabled vs consoleEnabled**

Setting `enabled` to false will disable all logger functionality (console output + hook invocations).

Setting `consoleEnabled` to false will disable just the console output but will still invoke the hooks.

So, for example, if you want to prevent writing logs to the browser console but still invoke a hook (i.e. to send logs to a server) then you would set `enabled: true` and `consoleEnabled: false`.

### **callerInfo**

Setting `callerInfo` to true will result in caller function information (fileName, functionName, lineNumber) being determined and included in the log, as well as being included in events provided to hooks, for each log function invocation.

### **prefixFormat**

Use the `prefixFormat` option to customize the message prefix (portion of log statement that appears before the arguments provided to the log function).
This can as well be used to inject additional information into the message prefix, such as timestamps or user identifiers for example.

The value of this option must be a function which accepts a partial LogEvent object and returns a string.  The provided LogEvent object contains only log `level` and `caller` information.

The default for this option is:
```typescript
prefixFormat: ({ level, caller }) => (
  caller
    ? `[${level.toUpperCase()}] [${caller?.fileName}:${caller?.functionName}:${caller?.lineNumber}]`
    : `[${level.toUpperCase()}]`
)
```

## Hooks

Hooks allow for advanced customization of the logger implementation, providing operations to be run before and after logging is performed.  These are defined on options as ```beforeHooks``` and ```afterHooks```.

> As of version 2.2.0, asynchronous & async/await support has been added, allowing for hooks which return a Promise from their `run` function.

### beforeHooks
Invoked before a statement is logged, can alter the log arguments which can impact the log output.

### afterHooks
Invoked after a statement is logged, cannot impact the log output.

### Built-in Hooks
The following hooks are available in this package and can be used by simply importing and adding them to the beforeHooks and/or afterHooks arrays of your options.

**`StringifyObjectsHook`**
Applies JSON.stringify on all objects provided as arguments to a logging method.
```js
import { createLogger, StringifyObjectsHook } from 'vue-logger-plugin'
const logger = createLogger({
  // ... (other options)
  beforeHooks: [ StringifyObjectsHook ]
})
```
**`StringifyAndParseObjectsHook`**
Applies JSON.stringify and JSON.parse on all objects provided as arguments to a logging method.
```js
import { createLogger, StringifyAndParseObjectsHook } from 'vue-logger-plugin'
const logger = createLogger({
  // ... (other options)
  beforeHooks: [ StringifyAndParseObjectsHook ]
})
```

The above are best used as 'before hooks' as they may purposefully alter the log output.  This way you are sure you are seeing the value of an object at the moment you log it. Otherwise, many browsers provide a live view that constantly updates as values change.

### Write Your Own Hooks

You can easily write your own hooks to apply custom logic.  A hook must implement a ```run``` function to handle a log event (an object containing the log level and the array of arguments which were passed to the logging method), and may optionally implement an ```install``` function which is invoked during plugin installation (or at the time of logger options application - see [Usage](#usage) section).

For reference, here are the interfaces:
```ts
export interface LoggerHook {
  run (event: LogEvent): void | Promise<void>
  install? (options: LoggerOptions): void
  props?: { [key: string]: any }
}
export interface LogEvent {
  level: LogLevel // 'debug' | 'info' | 'warn' | 'error' | 'log'
  argumentArray: any[]
  caller?: CallerInfo
}
export interface CallerInfo {
  fileName?: string
  functionName?: string
  lineNumber?: string
}
```

#### Sample Custom Hook - Leveraging Axios to Send Logs to Server
This is a basic example demonstrating how you could have the logger send log data to a server using an Axios client.

**`logger/index.ts`**
```ts
import { createLogger, StringifyObjectsHook, LoggerHook, LogEvent } from 'vue-logger-plugin'
import axios from 'axios'

const ServerLogHook: LoggerHook = {
  run(event: LogEvent) {
    axios.post('/log', { severity: event.level, data: event.argumentArray })
  }
  // example using async/await:
  // async run(event: LogEvent) {
  //   await axios.post('/log', { severity: event.level, data: event.argumentArray })
  // }
}

const options: LoggerOptions = {
  // ... (other options)
  beforeHooks: [ StringifyObjectsHook ],
  afterHooks: [ ServerLogHook ]
}

export default logger
```

## Usage

**Options API**:  The logger instance will be available on global properties as `$log` and `$logger`.

**Composition API**:  Import and use the ```useLogger``` method to inject the logger instance.

```js
import { defineComponent } from 'vue'
import { useLogger } from 'vue-logger-plugin'
export default defineComponent({
  // example using composition api
  setup() {
    const log = useLogger()
    log.info('Setting up MyComponent...')
    return {}
  },
  // example using options api
  methods: {
    test() {
      const testObject = {
        name: 'test',
        value: 'this is a test object'
      }
      this.$log.debug('Test Message', testObject)
      this.$log.info('Test Message', testObject)
      this.$log.warn('Test Message', testObject)
      this.$log.error('Test Message', testObject)
      this.$log.log('Test Message', testObject)
      // change options
      this.$log.apply({ level: 'error' }) // applies new log level
      this.$log.warn('This is not logged now')
    }
  }
})
```

As described in the Vue Plugin Install section above, options can be provided to the ```createLogger``` function for customizing the logging implementation.  As well, the logger options can be applied at any time to the logger on the Vue instance via the ```apply``` function (as demonstrated in the above example code).  This allows for on-demand enabling/disabling of the logger and adjusting log levels as needed from within your components.  Any options available to createLogger are also available to the apply function.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[npm-image]: https://img.shields.io/npm/v/vue-logger-plugin.svg
[npm-url]: https://npmjs.org/package/vue-logger-plugin
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[codecov-image]: https://codecov.io/gh/dev-tavern/vue-logger-plugin/branch/master/graph/badge.svg?token=WZDGBNBIW5
[codecov-url]: https://codecov.io/gh/dev-tavern/vue-logger-plugin
[circleci-image]: https://circleci.com/gh/dev-tavern/vue-logger-plugin.svg?style=svg
[circleci-url]: https://circleci.com/gh/dev-tavern/vue-logger-plugin
[minified-image]: https://badgen.net/bundlephobia/min/vue-logger-plugin
[minzipped-image]: https://badgen.net/bundlephobia/minzip/vue-logger-plugin
