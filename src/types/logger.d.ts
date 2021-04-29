import { App } from 'vue'

/**
 * @class
 * @example
 * // plugins/logger.ts
 * import { createLogger, StringifyObjectsHook } from 'vue-logger-plugin'
 * const logger = createLogger({
 *  enabled: true,
 *  level: 'debug',
 *  beforeHooks: [
 *    StringifyObjectsHook
 *  ]
 * })
 * export default logger
 *
 * // main.ts
 * import { createApp } from 'vue'
 * import App from './App.vue'
 * import logger from './plugins/logger'
 * createApp(App)
 *  .use(logger)
 *  .mount('#app')
 */
export declare class VueLogger {
  constructor (options?: LoggerOptions)
  /**
   * Applies log options to this Logger.
   * The provided options will be merged with existing options already applied.
   * @param options {LoggerOptions}
   */
  apply (options: LoggerOptions): void
  /**
   * Perform debug level logging.
   *
   * Only performed if LoggerOptions.level is one of: debug
   * @param args
   */
  debug (...args: any): void
  /**
   * Perform info level logging.
   *
   * Only performed if LoggerOptions.level is one of: debug, info
   * @param args
   */
  info (...args: any): void
  /**
   * Perform warning level logging.
   *
   * Only performed if LoggerOptions.level is one of: debug, info, warn
   * @param args
   */
  warn (...args: any): void
  /**
   * Perform error level logging.
   *
   * Only performed if LoggerOptions.level is one of: debug, info, warn, error
   * @param args
   */
  error (...args: any): void
  /**
   * Perform generic (console.log) level logging.
   *
   * Performed if Logger.Options.level is one of: debug, info, warn, error, log
   * @param args
   */
  log (...args: any): void
  /**
   * Returns whether logging is enabled.
   */
  enabled (): boolean
  /**
   * Returns the currently applied logging level (one of: debug, info, warn, error, log).
   */
  level (): string
  install (app: App): void
}

/**
 * Create a VueLogger instance that can be used on a Vue app.
 * @param options - {@link LoggerOptions}
 * @example
 * const logger = createLogger({
 *  enabled: true,
 *  level: 'debug',
 *  beforeHooks: [
 *    StringifyObjectsHook
 *  ],
 *  afterHooks: [
 *    run (event: LogEvent) {
 *      // event.level is the log level invoked (e.g. debug, info, warn, error)
 *      // event.argumentArray is the array of arguments which were passed to the logging method
 *    }
 *  ]
 * })
 */
export function createLogger (options: LoggerOptions): VueLogger

/**
 * Inject an instance of VueLogger which is provided by the Vue app.
 */
export function useLogger (): VueLogger

/**
 * Options for logging functionality.
 * @interface
 */
export interface LoggerOptions {
  /**
   * @field enabled {boolean} whether logging functionality is enabled or not
   */
  enabled?: boolean
  /**
   * @field consoleEnabled {boolean} whether writing to console is enabled or not
   */
  consoleEnabled?: boolean
  /**
   * @field level {string} the logging level (one of: debug, info, warn, error)
   */
  level?: string
  /**
   * @field beforeHooks {LoggerHook[]} hooks invoked before a statement is logged, can be used to alter log arguments (use carefully)
   */
  beforeHooks?: LoggerHook[]
  /**
   * @field afterHooks {LoggerHook[]} hooks invoked after a statement is logged, can be used for performing subsequent actions such as sending log data to a backend server
   */
  afterHooks?: LoggerHook[]
}

/**
 * Provides custom logic to be executed during a logging event.
 * @interface
 * @example
 * const customHook: LoggerHook = {
 *  run (event: LogEvent) {
 *    // event.level is the log level invoked (e.g. debug, info, warn, error)
 *    // event.argumentArray is the array of arguments which were passed to the logging method
 *  }
 * }
 */
export interface LoggerHook {
  run (event: LogEvent): void
  install? (options: LoggerOptions): void
  props?: { [key: string]: any }
}

/**
 * Contains information for a log invocation (log level, array of arguments).
 */
export interface LogEvent {
  level: string
  argumentArray: any[]
}