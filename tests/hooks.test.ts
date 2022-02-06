import { StringifyAndParseObjectsHook, StringifyObjectsHook } from '../src'
import { LogEvent } from '../src/types'

const testObject = { name: 'testObject' }

describe('hooks: StringifyObjectsHook', () => {

  it('stringifies object', () => {
    const event: LogEvent = {
      level: 'info',
      argumentArray: [testObject]
    }
    StringifyObjectsHook.run(event)
    expect(event.argumentArray).toContain('{"name":"testObject"}')
  })

  it('skips non-object', () => {
    const event: LogEvent = {
      level: 'info',
      argumentArray: ['test']
    }
    StringifyObjectsHook.run(event)
    expect(event.argumentArray).toContain('test')
  })

})

describe('hooks: StringifyAndParseObjectsHook', () => {

  it('stringifies and parses', () => {
    const event: LogEvent = {
      level: 'info',
      argumentArray: [testObject]
    }
    StringifyAndParseObjectsHook.run(event)
    expect(event.argumentArray[0]).toEqual(
      expect.objectContaining({
        name: 'testObject'
      })
    )
  })

  it('skips non-object', () => {
    const event: LogEvent = {
      level: 'info',
      argumentArray: ['test']
    }
    StringifyAndParseObjectsHook.run(event)
    expect(event.argumentArray[0]).toEqual('test')
  })

})
