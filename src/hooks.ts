import { LogEvent, LoggerHook } from './types'

export const StringifyObjectsHook: LoggerHook = {
  run(event: LogEvent) {
    for (let i = 0; i < event.argumentArray.length; i++) {
      if (event.argumentArray[i] != null && typeof event.argumentArray[i] === 'object') {
        event.argumentArray[i] = JSON.stringify(event.argumentArray[i])
      }
    }
  }
}

export const StringifyAndParseObjectsHook: LoggerHook = {
  run(event: LogEvent) {
    for (let i = 0; i < event.argumentArray.length; i++) {
      if (event.argumentArray[i] != null && typeof event.argumentArray[i] === 'object') {
        event.argumentArray[i] = JSON.parse(JSON.stringify(event.argumentArray[i]))
      }
    }
  }
}
