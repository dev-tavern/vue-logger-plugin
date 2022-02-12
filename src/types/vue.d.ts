/**
 * Vue module augmentation
 */
import { VueLogger } from './index'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $log: VueLogger
    $logger: VueLogger
  }
}
