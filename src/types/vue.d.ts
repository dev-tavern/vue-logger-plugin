/**
 * Augment the typings of Vue.js
 */
import Vue from 'vue'
import VueLogger from './index'

declare module 'vue/types/vue' {
  export interface Vue {
    $log: VueLogger
    $logger: VueLogger
  }
}
