import { createApp } from 'vue'
import { createLogger, VueLogger } from '../src'

const logger = createLogger()
const VueE = createApp({} as any).use(logger)

describe('plugin installation', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('logger is installed on Vue prototype as $log', () => {
    expect(typeof VueE.config.globalProperties.$log).toBe('object')
    expect(typeof VueE.config.globalProperties.$log.debug).toBe('function')
    expect(typeof VueE.config.globalProperties.$log.info).toBe('function')
    expect(typeof VueE.config.globalProperties.$log.warn).toBe('function')
    expect(typeof VueE.config.globalProperties.$log.error).toBe('function')
    expect(typeof VueE.config.globalProperties.$log.log).toBe('function')
    expect(typeof VueE.config.globalProperties.$log.apply).toBe('function')
  })

  it('logger is installed on Vue prototype as $logger', () => {
    expect(typeof VueE.config.globalProperties.$logger).toBe('object')
    expect(typeof VueE.config.globalProperties.$logger.debug).toBe('function')
    expect(typeof VueE.config.globalProperties.$logger.info).toBe('function')
    expect(typeof VueE.config.globalProperties.$logger.warn).toBe('function')
    expect(typeof VueE.config.globalProperties.$logger.error).toBe('function')
    expect(typeof VueE.config.globalProperties.$logger.log).toBe('function')
    expect(typeof VueE.config.globalProperties.$logger.apply).toBe('function')
  })

  it('instantiated logger is installed on Vue prototype', () => {
    const VueE2 = createApp({} as any).use(new VueLogger({ level: 'info' }))
    expect(typeof VueE2.config.globalProperties.$log).toBe('object')
    expect(VueE2.config.globalProperties.$log.level).toBe('info')
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
