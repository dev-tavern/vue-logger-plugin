import { VueConstructor } from 'vue'
import VueLogger from './index'
import { LoggerOptions } from './types'

export function install (Vue: VueConstructor, options: LoggerOptions = {}) {
  let Logger: VueLogger
  if (this instanceof VueLogger) {
    Logger = (this as VueLogger)
    if (options !== {}) Logger.apply(options)
  } else {
    Logger = new VueLogger(options)
  }
  Vue.prototype.$log = Logger
  Vue.prototype.$logger = Logger
}