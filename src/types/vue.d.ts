
/**
 * Extends interfaces in Vue.js
 */

import { ComponentCustomOptions } from 'vue'
import { VueLogger } from './index'

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    log?: VueLogger
    logger?: VueLogger
  }
}
