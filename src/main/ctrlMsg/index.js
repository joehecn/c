
import { dialog } from 'electron'
import txts from '../txt/txts.js'
import cover from '../txt/cover.js'

// import api from '../api/index.js'
// import retainClient from '../mqtt/retainClient.js'
// import testingClients from '../mqtt/testingClients.js'
// import acceptClient from '../mqtt/acceptClient.js'

const methods = {
  // async login (msg, _) {
  //   const { req } = msg
  //   const data = await api.sLogin(req)
  //   msg.body = data
  // },

  async selectDir (msg, win) {
    const { req: { defaultPath } } = msg
    const options = {
      title: 'Select the work directory',
      properties: ['openDirectory', 'createDirectory']
    }

    if (defaultPath) options.defaultPath = defaultPath
    const data = await dialog.showOpenDialog(win, options)

    msg.body = {
      code: 0,
      message: '',
      data
    }
  },

  async findTxtlist (msg, _) {
    const { req: { workDir, date } } = msg

    // console.log({ workDir, date })
    const data = await txts(workDir, date)

    msg.body = {
      code: 0,
      message: '',
      data
    }
  },

  async coverTxt (msg, _) {
    const { req: { filepath, name } } = msg

    // console.log({ filepath, name })
    const data = await cover(filepath, name)

    msg.body = {
      code: 0,
      message: '',
      data
    }
  }

  // async organizelist (msg, _) {
  //   const { req } = msg
  //   const data = await api.sOrganizelist(req)
  //   msg.body = data
  // },

  // async datasourcelist (msg, _) {
  //   const { req } = msg
  //   const data = await api.sDatasourcelist(req)
  //   msg.body = data
  // },
  // async devicepoint (msg, _) {
  //   const { req } = msg
  //   const data = await api.sDevicepointcascade(req)
  //   msg.body = data
  // },

  // async tznamelist (msg, _) {
  //   const { req } = msg
  //   const data = await api.sTznamelist(req)
  //   msg.body = data
  // },

  // async reportexcellist (msg, _) {
  //   const { req } = msg
  //   const data = await api.sReportExcelList(req)
  //   msg.body = data
  // },

  // async findTables (msg, _) {
  //   // console.log({ msg })
  //   const { req } = msg
  //   const data = await api.sFindTables(req)
  //   msg.body = data
  // },

  // async findHeaders (msg, _) {
  //   // console.log({ msg })
  //   const { req } = msg
  //   const data = await api.sFindHeaders(req)
  //   msg.body = data
  // },

  // async dbConfigList (msg, _) {
  //   // console.log({ msg })
  //   const { req } = msg
  //   const data = await api.sDbConfigList(req)
  //   msg.body = data
  // },

  // async dbConfigAdd (msg, _) {
  //   // console.log('---- dbConfigAdd')
  //   // console.log({ msg })
  //   const { req } = msg
  //   const data = await api.sDbConfigAdd(req)
  //   // console.log({ data })
  //   msg.body = data
  // },

  // async dbConfigUpdate (msg, _) {
  //   // console.log({ msg })
  //   const { req } = msg
  //   const data = await api.sDbConfigUpdate(req)
  //   msg.body = data
  // },

  // async dbConfigRemove (msg, _) {
  //   // console.log({ msg })
  //   const { req } = msg
  //   const data = await api.sDbConfigRemove(req)
  //   msg.body = data
  // },

  // createRetainClient (msg, win) {
  //   retainClient.getRetainClient(msg.req.where, win)

  //   msg.body = {
  //     code: 0,
  //     message: ''
  //   }
  // },

  // removeRetainClient (msg, _) {
  //   retainClient.closeRetainClient()

  //   msg.body = {
  //     code: 0,
  //     message: ''
  //   }
  // },

  // removeRetainMsg (msg, _) {
  //   // console.log('---- ctrlMsg removeRetainMsg', msg.req.topic)
  //   retainClient.removeRetain(msg.req.topic, function(err) {
  //     // console.log('----- callback', { err })

  //     if (err) {
  //       msg.body = {
  //         code: 119,
  //         message: 'Remove Retain Error'
  //       }
  //     } else {
  //       msg.body = {
  //         code: 0,
  //         message: ''
  //       }
  //     }
  //   })
  // },

  // createAcceptClient (msg, win) {
  //   const topic = `EMB_PerformanceTesting/${msg.req.uniqueid}/+/+`
  //   const method = (topic, payload) => {
  //     // 第一时间获取 返回的 time
  //     const back = Date.now()
  //     // console.log({ topic, payload })
  //     // 主动向客户端 push 消息
  //     try {
  //       const payloadStr = payload.toString()
  //       const _payload = JSON.parse(payloadStr)
  //       if (_payload.send) {
  //         const ms = back - _payload.send

  //         const item = {
  //           topic,
  //           runIndex: _payload.runIndex,
  //           clientIndex: _payload.clientIndex,
  //           send: _payload.send,
  //           back,
  //           ms
  //         }
  //         win.webContents.send('main-send-test-mqtt', { item })
  //       }
  //     } catch (error) {
  //       console.error(error)
  //     }

  //   }
  //   acceptClient.getAcceptClient(msg.req.where, topic, method)

  //   msg.body = {
  //     code: 0,
  //     message: ''
  //   }
  // },

  // removeAcceptClient (msg, _) {
  //   acceptClient.closeAcceptClient()

  //   msg.body = {
  //     code: 0,
  //     message: ''
  //   }
  // },

  // async runTesting( msg, _) {
  //   await testingClients.runTClients(msg.req)

  //   msg.body = {
  //     code: 0,
  //     message: ''
  //   }
  // },

  // closeTesting(msg, _) {
  //   testingClients.closeTClients()

  //   msg.body = {
  //     code: 0,
  //     message: ''
  //   }
  // }
}

const ctrlMsg = async (msg, win) => {
  try {
    await methods[msg.key](msg, win)
  } catch (error) {
    // if (error.isAxiosError && error.response && error.response.data) {
    //   msg.body = error.response.data
    // } else {
    console.error(error)
    const code = error.status || error.code || 1000001
    const message = error.message || 'unknown error 1000001'
    msg.body = { code, message }
    // }
  }
}

export default ctrlMsg
