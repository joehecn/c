
import api from '../api/index.js'
// import retainClient from '../mqtt/retainClient.js'
// import testingClients from '../mqtt/testingClients.js'
// import acceptClient from '../mqtt/acceptClient.js'

const methods = {
  async login (msg) {

    const { req } = msg
    await api.sLogin(req)

    msg.body = {
      code: 0,
      message: ''
    }
  },

  async updateWorkDir (msg) {
    const { req: { workDir } } = msg
    await api.sUpdateWorkDir(workDir)

    msg.body = {
      code: 0,
      message: ''
    }
  },

  // for test
  async resetDir (msg) {
    await api.sResetDir()

    msg.body = {
      code: 0,
      message: ''
    }
  },

  async getTxt (msg) {
    const { req } = msg
    const data = await api.sGetTxt(req)

    msg.body = {
      code: 0,
      message: '',
      data
    }
  },

  async setTxt (msg) {
    const { req } = msg

    await api.sSetTxt(req)

    msg.body = {
      code: 0,
      message: ''
    }
  }
}

const work = {
  async send(msg) {
    try {
      await methods[msg.key](msg)
      return msg.body
    } catch (error) {
      console.log('--- work send error')
      console.error(error)
      const code = error.status || error.code || 1000002
      const message = error.message || 'unknown error 1000002'
      return { code, message }
    }
  }
}

export default work
