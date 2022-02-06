import './vue'
import { VueLogger } from './logger'

export default VueLogger

export {
  LoggerOptions,
  LoggerHook,
  LogEvent,
  LogLevel,
  CallerInfo
} from './logger'

export * from './hooks'
