import Vue from 'vue'
import VueLogger from '../src'

const VueE = Vue.extend()
VueE.use(VueLogger)

describe('plugin installation', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('logger is installed on Vue prototype as $log', () => {
    expect(typeof VueE.prototype.$log).toBe('object')
    expect(typeof VueE.prototype.$log.debug).toBe('function')
    expect(typeof VueE.prototype.$log.info).toBe('function')
    expect(typeof VueE.prototype.$log.warn).toBe('function')
    expect(typeof VueE.prototype.$log.error).toBe('function')
    expect(typeof VueE.prototype.$log.log).toBe('function')
    expect(typeof VueE.prototype.$log.apply).toBe('function')
  })

  it('logger is installed on Vue prototype as $logger', () => {
    expect(typeof VueE.prototype.$logger).toBe('object')
    expect(typeof VueE.prototype.$logger.debug).toBe('function')
    expect(typeof VueE.prototype.$logger.info).toBe('function')
    expect(typeof VueE.prototype.$logger.warn).toBe('function')
    expect(typeof VueE.prototype.$logger.error).toBe('function')
    expect(typeof VueE.prototype.$logger.log).toBe('function')
    expect(typeof VueE.prototype.$logger.apply).toBe('function')
  })

  it('instantiated logger is installed on Vue prototype', () => {
    const VueE2 = Vue.extend()
    VueE2.use(new VueLogger({ level: 'info' }))
    expect(typeof VueE2.prototype.$log).toBe('object')
    expect(VueE2.prototype.$log.level).toBe('info')
  })

  it('installs hooks', () => {
    const hook1 = {
      install: jest.fn(),
      run: jest.fn()
    }
    const hook2 = {
      install: jest.fn(),
      run: jest.fn()
    }
    new VueLogger({ level: 'info', beforeHooks: [hook1], afterHooks: [hook2] })
    expect(hook1.install).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info'
      })
    )
    expect(hook2.install).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info'
      })
    )
  })

  it('handles hook installation failure', () => {
    console.warn = jest.fn()
    const hook = {
      install: jest.fn(),
      run: jest.fn()
    }
    hook.install.mockImplementation(() => { throw Error('Test') })
    new VueLogger({ level: 'info', beforeHooks: [hook] })
    expect(console.warn).toHaveBeenCalledWith(
      'LoggerHook install failure',
      expect.anything()
    )
  })

})