import { App, inject } from 'vue'
import { LoggerOptions, LoggerHook, LogEvent, CallerInfo } from './types'

const loggerSymbol = Symbol('vue-logger-plugin')

const levels: string[] = ['debug', 'info', 'warn', 'error', 'log']

const defaultOptions: LoggerOptions = {
  enabled: true,
  consoleEnabled: true,
  level: 'debug',
  callerInfo: false,
  prefixFormat: ({ level, caller }) => {
    return caller
      ? `${level} | ${caller.fileName}::${caller.functionName} | `
      : `${level} | `
  }
}

export class VueLogger {

  private options: LoggerOptions
  private consoleFunctions: string[]

  constructor(options: LoggerOptions) {
    this.apply(options)
    this.consoleFunctions = levels.filter(lvl => typeof console[lvl] === 'function')
  }

  apply(options: LoggerOptions) {
    const fallback = this.options || defaultOptions
    this.options = { ...fallback, ...options }
    this.installHooks(this.options.beforeHooks)
    this.installHooks(this.options.afterHooks)
  }

  async debug(...args: any): Promise<void> {
    await this.invoke('debug', ...args)
  }

  async info(...args: any): Promise<void> {
    await this.invoke('info', ...args)
  }

  async warn(...args: any): Promise<void> {
    await this.invoke('warn', ...args)
  }

  async error(...args: any): Promise<void> {
    await this.invoke('error', ...args)
  }

  async log(...args: any): Promise<void> {
    await this.invoke('log', ...args)
  }

  private async invoke(level: string, ...args: any) {
    if (this.options.enabled && levels.indexOf(level) >= levels.indexOf(this.options.level)) {
      const caller: CallerInfo = this.options.callerInfo ? this.getCallerInfo() : undefined
      const event: LogEvent = { level, caller, argumentArray: args }
      await this.invokeHooks(this.options.beforeHooks, event)
      if (this.options.consoleEnabled) {
        const msgPrefix = this.options.prefixFormat({ level, caller })
        if (this.consoleFunctions.indexOf(level) >= 0) {
          console[level](msgPrefix, ...args)
        } else {
          console.log(msgPrefix, ...args)
        }
      }
      await this.invokeHooks(this.options.afterHooks, event)
    }
  }

  private installHooks(hooks: LoggerHook[]) {
    if (hooks && hooks.length > 0) {
      for (const hook of hooks) {
        if (hook.install) {
          try {
            hook.install(this.options)
          } catch (err) {
            console.warn('LoggerHook install failure', err)
          }
        }
      }
    }
  }

  private async invokeHooks(hooks: LoggerHook[], event: LogEvent) {
    if (hooks && hooks.length > 0) {
      for (const hook of hooks) {
        try {
          await hook.run(event)
        } catch (err) {
          console.warn('LoggerHook run failure', err)
        }
      }
    }
  }

  private getCallerInfo(): CallerInfo {
    const e = new Error()
    if (e.stack) {
      const callerFrame = e.stack.split('\n')[4].trim()
      const functionName = callerFrame.substring(callerFrame.indexOf('at ')+3, callerFrame.lastIndexOf(' ')).split('.').reverse()[0]
      const callerLocation = callerFrame.substring(callerFrame.indexOf('(')+1, callerFrame.lastIndexOf(')'))
      const callerLocationParts = callerLocation.split(':').reverse() // 0=columnNumber; 1=lineNumber; 2=file
      const fileName = callerLocationParts[2].substring(Math.max(callerLocationParts[2].lastIndexOf('/'), callerLocationParts[2].lastIndexOf('\\')) +1).split('?')[0]
      const lineNumber = callerLocationParts[1]
      return { functionName, fileName, lineNumber }
    }
    return undefined
  }

  get enabled() {
    return this.options.enabled
  }

  get level() {
    return this.options.level
  }

  install(app: App) {
    app.provide(loggerSymbol, this)
    app.config.globalProperties.$log = this
    app.config.globalProperties.$logger = this
  }

}

export function createLogger(options: LoggerOptions = {}) {
  return new VueLogger(options)
}

export function useLogger() {
  const logger = inject(loggerSymbol)
  if (!logger) {
    console.warn('vue-logger-plugin :: useLogger missing inject')
  }
  return logger
}
