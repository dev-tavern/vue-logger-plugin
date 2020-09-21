import { createApp } from 'vue'
import { createLogger } from '../src'

const logger = createLogger()
const VueE = createApp({} as any).use(logger)

describe('logging', () => {

  const testObject = { name: 'testObject' }

  it('debug logs to console.debug', () => {
    console.debug = jest.fn()
    VueE.config.globalProperties.$log.debug('test')
    VueE.config.globalProperties.$log.debug('test', testObject)
    expect(console.debug).toHaveBeenCalledWith('debug | ', 'test')
    expect(console.debug).toHaveBeenCalledWith('debug | ', 'test', testObject)
  })

  it('info logs to console.info', () => {
    console.info = jest.fn()
    VueE.config.globalProperties.$log.info('test')
    VueE.config.globalProperties.$log.info('test', testObject)
    expect(console.info).toHaveBeenCalledWith('info | ', 'test')
    expect(console.info).toHaveBeenCalledWith('info | ', 'test', testObject)
  })

  it('warn logs to console.warn', () => {
    console.warn = jest.fn()
    VueE.config.globalProperties.$log.warn('test')
    VueE.config.globalProperties.$log.warn('test', testObject)
    expect(console.warn).toHaveBeenCalledWith('warn | ', 'test')
    expect(console.warn).toHaveBeenCalledWith('warn | ', 'test', testObject)
  })

  it('error logs to console.error', () => {
    console.error = jest.fn()
    VueE.config.globalProperties.$log.error('test')
    VueE.config.globalProperties.$log.error('test', testObject)
    expect(console.error).toHaveBeenCalledWith('error | ', 'test')
    expect(console.error).toHaveBeenCalledWith('error | ', 'test', testObject)
  })

  it('log logs to console.log', () => {
    console.log = jest.fn()
    VueE.config.globalProperties.$log.log('test')
    VueE.config.globalProperties.$log.log('test', testObject)
    expect(console.log).toHaveBeenCalledWith('log | ', 'test')
    expect(console.log).toHaveBeenCalledWith('log | ', 'test', testObject)
  })

})