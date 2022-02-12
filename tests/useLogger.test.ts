import { createLogger, useLogger } from '../src'
import { inject } from 'vue'
import { mocked } from 'ts-jest/utils'

jest.mock('vue', () => ({
  inject: jest.fn()
}))

const logger = createLogger()

describe('useLogger', () => {

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns logger from inject', () => {
    const mockedInject = mocked(inject)
    mockedInject.mockReturnValue(logger)
    const l2 = useLogger()
    expect(mockedInject).toHaveBeenCalled()
    expect(l2).toBe(logger)
  })

  it('handles logger missing from inject', () => {
    console.warn = jest.fn()
    const mockedInject = mocked(inject)
    mockedInject.mockReturnValue(undefined)
    useLogger()
    expect(console.warn).toHaveBeenCalledWith('vue-logger-plugin :: useLogger missing inject')
  })

})
