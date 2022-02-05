import { createLogger } from '../src'

const uuid = 'uuid123'

const logger = createLogger({
  callerInfo: true,
  // prefixFormat: (event) => `[${event.level}] [${event.caller.fileName}::${event.caller.functionName}::${event.caller.lineNumber}] [${uuid}]`
  prefixFormat: ({ level, caller }) => {
    return `[${level}] [${caller.fileName}::${caller.functionName}::${caller.lineNumber}] [${uuid}]`
  },
  beforeHooks: [
    {
      run: async (event) => {
        console.log('hello001')
        await sleep(5000)
        console.log('hello002')
      }
    }
    // {
    //   props: { test: 'hello' },
    //   async run(event) {
    //     console.log('hello001')
    //     await sleep(5000)
    //     this.props.test
    //     console.log(this.props.test)
    //   }
    // },
    // {
    //   props: { test: 'hello' },
    //   run: async function (event) {
    //     console.log('hello001')
    //     await sleep(5000)
    //     this.props.test
    //     console.log(this.props.test)
    //   }
    // }
  ]
})

async function doLog() {
  // logger.error('TESTING')
  await logger.debug('TESTING')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// function tempFn(level: string) {
//   console.log(level)
//   tempFn2({ level })
//   console.log(level)
// }

// function tempFn2({ level }) {
//   level = 'test2'
// }

it.skip('temp', async () => {
  console.log('----- START ----')
  await doLog()
  console.log('----- END ----')
  expect(1).toBe(1)
  // tempFn('test1')
})
