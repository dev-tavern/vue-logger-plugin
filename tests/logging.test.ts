import { createApp } from 'vue'
import { createLogger } from '../src'

describe('logging: levels', () => {

  const logger = createLogger()
  const VueE = createApp({} as any).use(logger)

  const testObject = { name: 'testObject' }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('debug logs to console.debug', async () => {
    console.debug = jest.fn()
    await VueE.config.globalProperties.$log.debug('test')
    await VueE.config.globalProperties.$log.debug('test', testObject)
    expect(console.debug).toHaveBeenCalledWith('debug | ', 'test')
    expect(console.debug).toHaveBeenCalledWith('debug | ', 'test', testObject)
  })

  it('info logs to console.info', async () => {
    console.info = jest.fn()
    await VueE.config.globalProperties.$log.info('test')
    await VueE.config.globalProperties.$log.info('test', testObject)
    expect(console.info).toHaveBeenCalledWith('info | ', 'test')
    expect(console.info).toHaveBeenCalledWith('info | ', 'test', testObject)
  })

  it('warn logs to console.warn', async () => {
    console.warn = jest.fn()
    await VueE.config.globalProperties.$log.warn('test')
    await VueE.config.globalProperties.$log.warn('test', testObject)
    expect(console.warn).toHaveBeenCalledWith('warn | ', 'test')
    expect(console.warn).toHaveBeenCalledWith('warn | ', 'test', testObject)
  })

  it('error logs to console.error', async () => {
    console.error = jest.fn()
    await VueE.config.globalProperties.$log.error('test')
    await VueE.config.globalProperties.$log.error('test', testObject)
    expect(console.error).toHaveBeenCalledWith('error | ', 'test')
    expect(console.error).toHaveBeenCalledWith('error | ', 'test', testObject)
  })

  it('log logs to console.log', async () => {
    console.log = jest.fn()
    await VueE.config.globalProperties.$log.log('test')
    await VueE.config.globalProperties.$log.log('test', testObject)
    expect(console.log).toHaveBeenCalledWith('log | ', 'test')
    expect(console.log).toHaveBeenCalledWith('log | ', 'test', testObject)
  })

})

describe('logging: unsupported', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('unsupported console function logs to console.log', async () => {
    console.warn = undefined
    console.log = jest.fn()
    const logger = createLogger()
    await logger.warn('test')
    expect(console.log).toHaveBeenCalledWith('warn | ', 'test')
  })

})

describe('logging: hooks', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('invokes before hooks', async () => {
    const hook = {
      run: jest.fn()
    }
    const logger = createLogger({ beforeHooks: [hook] })
    await logger.log('test')
    expect(hook.run).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'log',
        argumentArray: ['test']
      })
    )
  })

  it('invokes after hooks', async () => {
    const hook = {
      run: jest.fn()
    }
    const logger = createLogger({ afterHooks: [hook] })
    await logger.log('test')
    expect(hook.run).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'log',
        argumentArray: ['test']
      })
    )
  })

  it('handles hook run failure', async () => {
    console.warn = jest.fn()
    const hook = {
      run: jest.fn()
    }
    hook.run.mockImplementation(() => { throw Error('Test') })
    const logger = createLogger({ beforeHooks: [hook] })
    await logger.log('test')
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

  it('does not write to console', async () => {
    console.log = jest.fn()
    const logger = createLogger({ enabled: false })
    await logger.log('test')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('does not invoke hooks', async () => {
    console.log = jest.fn()
    const hook = {
      run: jest.fn()
    }
    const logger = createLogger({ enabled: false, beforeHooks: [hook] })
    await logger.log('test')
    expect(hook.run).not.toHaveBeenCalled()
  })

})

describe('logging: console disabled', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('does not write to console', async () => {
    console.log = jest.fn()
    const logger = createLogger({ consoleEnabled: false })
    await logger.log('test')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('does invoke hooks', async () => {
    console.log = jest.fn()
    const hook = {
      run: jest.fn()
    }
    const logger = createLogger({ consoleEnabled: false, beforeHooks: [hook] })
    await logger.log('test')
    expect(hook.run).toHaveBeenCalled()
  })

})

describe('logging: prefix format', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('uses custom format when provided', async () => {
    console.debug = jest.fn()
    const logger = createLogger({ prefixFormat: ({ level }) => `[${level.toUpperCase()}]` })
    await logger.debug('test')
    expect(console.debug).toHaveBeenCalledWith('[DEBUG]', 'test')
  })

})

describe('logging: caller info', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  async function doLog(logger) {
    await logger.debug('test')
  }

  it('logs caller info', async () => {
    console.debug = jest.fn()
    const logger = createLogger({ callerInfo: true })
    await doLog(logger)
    expect(console.debug).toHaveBeenCalledWith('debug | logging.test.ts::doLog | ', 'test')
  })

  it('does not log caller info when stack unavailable', async () => {
    const mockErrorStack = jest.spyOn(window.Error, 'prepareStackTrace') as any
    mockErrorStack.mockImplementation(() => undefined)
    const logger = createLogger({ callerInfo: true })
    await doLog(logger)
    expect(console.debug).toHaveBeenCalledWith('debug | ', 'test')
  })

})
