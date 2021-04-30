import Vue from 'vue'
import VueLogger from '../src'

// const VueE = Vue.extend()
// VueE.use(VueLogger)

describe('logging: levels', () => {

  const VueE = Vue.extend()
  VueE.use(VueLogger)

  const testObject = { name: 'testObject' }

  afterEach(() => {
    jest.resetAllMocks()
  })

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

describe('logging: unsupported', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('unsupported console function logs to console.log', () => {
    console.warn = undefined
    console.log = jest.fn()
    const logger = new VueLogger({})
    logger.warn('test')
    expect(console.log).toHaveBeenCalledWith('warn | ', 'test')
  })

})

describe('logging: hooks', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('invokes before hooks', () => {
    const hook = {
      run: jest.fn()
    }
    const logger = new VueLogger({ beforeHooks: [hook] })
    logger.log('test')
    expect(hook.run).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'log',
        argumentArray: ['test']
      })
    )
  })

  it('invokes after hooks', () => {
    const hook = {
      run: jest.fn()
    }
    const logger = new VueLogger({ afterHooks: [hook] })
    logger.log('test')
    expect(hook.run).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'log',
        argumentArray: ['test']
      })
    )
  })

  it('handles hook run failure', () => {
    console.warn = jest.fn()
    const hook = {
      run: jest.fn()
    }
    hook.run.mockImplementation(() => { throw Error('Test') })
    const logger = new VueLogger({ beforeHooks: [hook] })
    logger.log('test')
    expect(console.warn).toHaveBeenCalledWith(
      'LoggerHook run failure',
      expect.anything()
    )
  })

})

describe('logging: disabled', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('does not write to console', () => {
    console.log = jest.fn()
    const logger = new VueLogger({ enabled: false })
    logger.log('test')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('does not invoke hooks', () => {
    console.log = jest.fn()
    const hook = {
      run: jest.fn()
    }
    const logger = new VueLogger({ enabled: false, beforeHooks: [hook] })
    logger.log('test')
    expect(hook.run).not.toHaveBeenCalled()
  })

})

describe('logging: console disabled', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('does not write to console', () => {
    console.log = jest.fn()
    const logger = new VueLogger({ consoleEnabled: false })
    logger.log('test')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('does invoke hooks', () => {
    console.log = jest.fn()
    const hook = {
      run: jest.fn()
    }
    const logger = new VueLogger({ consoleEnabled: false, beforeHooks: [hook] })
    logger.log('test')
    expect(hook.run).toHaveBeenCalled()
  })

})
