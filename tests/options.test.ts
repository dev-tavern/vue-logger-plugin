import VueLogger from '../src'
import { LoggerOptions } from '../src/types'

describe('options', () => {

  it('defaults are applied when options are not provided to constructor', () => {
    const Log = new VueLogger({})
    expect(Log.enabled).toBe(true)
    expect(Log.level).toBe('debug')
  })

  it('custom options are applied when provided to constructor', () => {
    const options: LoggerOptions = {
      level: 'error'
    }
    const Log = new VueLogger(options)
    expect(Log.level).toBe('error')
  })

  it('custom options are applied when provided to Logger.apply', () => {
    const Log = new VueLogger({ level: 'info' })
    expect(Log.level).toBe('info')
    Log.apply({ level: 'error' })
    expect(Log.level).toBe('error')
  })

})
