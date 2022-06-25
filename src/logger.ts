import { install } from './install'
import { LoggerOptions, LoggerHook, LogEvent, CallerInfo, LogLevel } from './types'

const isProduction = process.env.NODE_ENV === 'production'

const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'log']

const defaultOptions: LoggerOptions = {
  enabled: true,
  consoleEnabled: true,
  level: 'debug',
  callerInfo: false,
  prefixFormat: ({ level, caller }) => (
    caller
      ? `[${level.toUpperCase()}] [${caller?.fileName}:${caller?.functionName}:${caller?.lineNumber}]`
      : `[${level.toUpperCase()}]`
  )
}

export default class VueLogger {

  static install = install
  install = install
  private _options: LoggerOptions
  private _consoleFunctions: string[]

  constructor(options: LoggerOptions) {
    this.apply(options)
    this._consoleFunctions = levels.filter(lvl => typeof console[lvl] === 'function')
  }

  apply(options: LoggerOptions) {
    const fallback = this._options || defaultOptions
    this._options = { ...fallback, ...options }
    this.installHooks(this._options.beforeHooks)
    this.installHooks(this._options.afterHooks)
  }

  debug(...args: any): void {
    this._invoke('debug', ...args)
  }

  info(...args: any): void {
    this._invoke('info', ...args)
  }

  warn(...args: any): void {
    this._invoke('warn', ...args)
  }

  error(...args: any): void {
    this._invoke('error', ...args)
  }

  log(...args: any): void {
    this._invoke('log', ...args)
  }

  private _invoke(level: LogLevel, ...args: any) {
    if (this._options.enabled && levels.indexOf(level) >= levels.indexOf(this._options.level)) {
      const caller: CallerInfo = this._options.callerInfo ? this.getCallerInfo() : undefined
      const event: LogEvent = { level, caller, argumentArray: args }
      this.invokeHooks(this._options.beforeHooks, event)
      if (this._options.consoleEnabled) {
        const msgPrefix = this._options.prefixFormat({ level, caller })
        if (this._consoleFunctions.indexOf(level) >= 0) {
          console[level](msgPrefix, ...args)
        } else {
          console.log(msgPrefix, ...args)
        }
      }
      this.invokeHooks(this._options.afterHooks, event)
    }
  }

  private installHooks(hooks: LoggerHook[]) {
    if (hooks && hooks.length > 0) {
      hooks.forEach(hook => {
        if (hook.install) {
          try {
            hook.install(this._options)
          } catch (err) {
            console.warn('LoggerHook install failure', err)
          }
        }
      })
    }
  }

  private invokeHooks(hooks: LoggerHook[], event: LogEvent) {
    if (hooks && hooks.length > 0) {
      hooks.forEach(hook => {
        try {
          hook.run(event)
        } catch (err) {
          console.warn('LoggerHook run failure', err)
        }
      })
    }
  }

  private getCallerInfo(): CallerInfo {
    const e = new Error()
    if (e.stack) {
      try {
        // Chrome / Edge:  caller function located at stack frame index 4, in format like: at <functionName> (<filePath/fileName>:<lineNumber>:<columnNumber>)
        // Firefox:  caller function located at stack frame index 3, in format like: <functionName>@<filePath/fileName>:<lineNumber>:<columnNumber>
        const frames = e.stack.split('\n')
        const callerFrameIndex = frames[0].startsWith('Error') ? 4 : 3
        const callerFrame = e.stack.split('\n')[callerFrameIndex].trim().replace('(', '').replace(')', '')
        let functionName
        if (callerFrame.indexOf('at ') > -1) {
          functionName = callerFrame.substring(callerFrame.indexOf('at ')+3, callerFrame.lastIndexOf(' ')).split('.').reverse()[0]
        } else if (callerFrame.indexOf('@') > -1) {
          functionName = callerFrame.substring(0, callerFrame.indexOf('@'))
        }
        const callerLocationParts = callerFrame.split(':').reverse() // 0=columnNumber; 1=lineNumber; 2=file
        const fileName = callerLocationParts[2].substring(Math.max(callerLocationParts[2].lastIndexOf('/'), callerLocationParts[2].lastIndexOf('\\')) +1).split('?')[0]
        const lineNumber = callerLocationParts[1]
        return { functionName, fileName, lineNumber }
      } catch (err) {
        if (!isProduction) {
          console.debug('vue-logger-plugin :: failed to determine caller function info')
        }
      }
    }
    return undefined
  }

  get enabled() {
    return this._options.enabled
  }

  get level() {
    return this._options.level
  }

}
