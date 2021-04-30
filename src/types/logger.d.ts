import { PluginFunction } from 'vue'

/**
 * @class
 * @example
 * ```ts
 * Vue.use(VueLogger, { ... })
 * ```
 * @example
 * ```ts
 * Vue.use(new VueLogger({
 *  enabled: true,
 *  level: 'debug',
 *  beforeHooks: [
 *    {
 *      run (event) => { event.argumentArray.unshift('ALTERED') }
 *    },
 *    StringifyObjectsHook
 *  ],
 *  afterHooks: [
 *    run (event) => {
 *      if (event.level === 'error') {
 *        axios.post('/log', { severity: event.level, data: event.argumentArray })
 *      }
 *    }
 *  ]
 * }))
 * ```
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
  install: PluginFunction<LoggerOptions>
  static install: PluginFunction<LoggerOptions>
}

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

export interface LoggerHook {
  run (event: LogEvent): void
  install? (options: LoggerOptions): void
  props?: { [key: string]: any }
}

export interface LogEvent {
  level: string
  argumentArray: any[]
}
