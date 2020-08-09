import { createLogger } from '../src'
import { LoggerOptions } from '../src/types'

describe('options', () => {

  it('defaults are applied when options are not provided', () => {
    const Log = createLogger()
    expect(Log.enabled).toBe(true)
    expect(Log.level).toBe('debug')
  })

  it('custom options are applied when provided', () => {
    const options: LoggerOptions = {
      level: 'error'
    }
    const Log = createLogger(options)
    expect(Log.level).toBe('error')
  })

  it('custom options are applied when provided to Logger.apply', () => {
    const Log = createLogger({ level: 'info' })
    expect(Log.level).toBe('info')
    Log.apply({ level: 'error' })
    expect(Log.level).toBe('error')
  })

})