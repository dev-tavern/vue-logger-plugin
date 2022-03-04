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
    VueE.config.globalProperties.$log.debug('test')
    VueE.config.globalProperties.$log.debug('test', testObject)
    await new Promise(process.nextTick)
    expect(console.debug).toHaveBeenCalledWith('[DEBUG]', 'test')
    expect(console.debug).toHaveBeenCalledWith('[DEBUG]', 'test', testObject)
  })

  it('info logs to console.info', async () => {
    console.info = jest.fn()
    VueE.config.globalProperties.$log.info('test')
    VueE.config.globalProperties.$log.info('test', testObject)
    await new Promise(process.nextTick)
    expect(console.info).toHaveBeenCalledWith('[INFO]', 'test')
    expect(console.info).toHaveBeenCalledWith('[INFO]', 'test', testObject)
  })

  it('warn logs to console.warn', async () => {
    console.warn = jest.fn()
    VueE.config.globalProperties.$log.warn('test')
    VueE.config.globalProperties.$log.warn('test', testObject)
    await new Promise(process.nextTick)
    expect(console.warn).toHaveBeenCalledWith('[WARN]', 'test')
    expect(console.warn).toHaveBeenCalledWith('[WARN]', 'test', testObject)
  })

  it('error logs to console.error', async () => {
    console.error = jest.fn()
    VueE.config.globalProperties.$log.error('test')
    VueE.config.globalProperties.$log.error('test', testObject)
    await new Promise(process.nextTick)
    expect(console.error).toHaveBeenCalledWith('[ERROR]', 'test')
    expect(console.error).toHaveBeenCalledWith('[ERROR]', 'test', testObject)
  })

  it('log logs to console.log', async () => {
    console.log = jest.fn()
    VueE.config.globalProperties.$log.log('test')
    VueE.config.globalProperties.$log.log('test', testObject)
    await new Promise(process.nextTick)
    expect(console.log).toHaveBeenCalledWith('[LOG]', 'test')
    expect(console.log).toHaveBeenCalledWith('[LOG]', 'test', testObject)
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
    logger.warn('test')
    await new Promise(process.nextTick)
    expect(console.log).toHaveBeenCalledWith('[WARN]', 'test')
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
    logger.log('test')
    await new Promise(process.nextTick)
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
    logger.log('test')
    await new Promise(process.nextTick)
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
    logger.log('test')
    await new Promise(process.nextTick)
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
    logger.log('test')
    await new Promise(process.nextTick)
    expect(console.log).not.toHaveBeenCalled()
  })

  it('does not invoke hooks', async () => {
    console.log = jest.fn()
    const hook = {
      run: jest.fn()
    }
    const logger = createLogger({ enabled: false, beforeHooks: [hook] })
    logger.log('test')
    await new Promise(process.nextTick)
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
    logger.log('test')
    await new Promise(process.nextTick)
    expect(console.log).not.toHaveBeenCalled()
  })

  it('does invoke hooks', async () => {
    console.log = jest.fn()
    const hook = {
      run: jest.fn()
    }
    const logger = createLogger({ consoleEnabled: false, beforeHooks: [hook] })
    logger.log('test')
    await new Promise(process.nextTick)
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
    logger.debug('test')
    await new Promise(process.nextTick)
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

  function doLog(logger) {
    logger.debug('test')
  }

  it('logs caller info', async () => {
    console.debug = jest.fn()
    const logger = createLogger({ callerInfo: true })
    doLog(logger)
    await new Promise(process.nextTick)
    expect(console.debug).toHaveBeenCalledWith('[DEBUG] [logging.test.ts:doLog:213]', 'test')
  })

  it('does not log caller info when stack unavailable', async () => {
    const mockErrorStack = jest.spyOn(window.Error, 'prepareStackTrace') as any
    mockErrorStack.mockImplementation(() => undefined)
    const logger = createLogger({ callerInfo: true })
    doLog(logger)
    await new Promise(process.nextTick)
    expect(console.debug).toHaveBeenCalledWith('[DEBUG]', 'test')
  })

})
