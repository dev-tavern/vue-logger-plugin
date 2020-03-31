import Vue from 'vue'
import VueLogger from '../src'

const VueE = Vue.extend()
VueE.use(VueLogger)

describe('logging', () => {

  const testObject = { name: 'testObject' }

  it('debug logs to console.debug', () => {
    console.debug = jest.fn()
    VueE.prototype.$log.debug('test')
    VueE.prototype.$log.debug('test', testObject)
    expect(console.debug).toHaveBeenCalledWith('debug | ', 'test')
    expect(console.debug).toHaveBeenCalledWith('debug | ', 'test', testObject)
  })

  it('info logs to console.info', () => {
    console.info = jest.fn()
    VueE.prototype.$log.info('test')
    VueE.prototype.$log.info('test', testObject)
    expect(console.info).toHaveBeenCalledWith('info | ', 'test')
    expect(console.info).toHaveBeenCalledWith('info | ', 'test', testObject)
  })

  it('warn logs to console.warn', () => {
    console.warn = jest.fn()
    VueE.prototype.$log.warn('test')
    VueE.prototype.$log.warn('test', testObject)
    expect(console.warn).toHaveBeenCalledWith('warn | ', 'test')
    expect(console.warn).toHaveBeenCalledWith('warn | ', 'test', testObject)
  })

  it('error logs to console.error', () => {
    console.error = jest.fn()
    VueE.prototype.$log.error('test')
    VueE.prototype.$log.error('test', testObject)
    expect(console.error).toHaveBeenCalledWith('error | ', 'test')
    expect(console.error).toHaveBeenCalledWith('error | ', 'test', testObject)
  })

  it('log logs to console.log', () => {
    console.log = jest.fn()
    VueE.prototype.$log.log('test')
    VueE.prototype.$log.log('test', testObject)
    expect(console.log).toHaveBeenCalledWith('log | ', 'test')
    expect(console.log).toHaveBeenCalledWith('log | ', 'test', testObject)
  })

})