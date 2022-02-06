import './vue'
import { VueLogger } from './logger'

export default VueLogger

export {
  LoggerOptions,
  LoggerHook,
  LogEvent,
  CallerInfo
} from './logger'

export * from './hooks'
