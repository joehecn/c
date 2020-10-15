
import github from '../github/index.js'
import userController from '../controller/user.js'
import workDirController from '../controller/workDir.js'
import api from '../api/index.js'
// import ipc from '../ipc/index.js'

const methods = {
  // async testOK(query, _uuid) {
  //   postMessage({
  //     body: {
  //       code: 0,
  //       message: '',
  //       data: query.arg
  //     },
  //     _uuid
  //   })
  // },

  // async testError(query) {
  //   const err = new Error(`test Error ${query.arg}`)
  //   err.code = 10001
  //   throw err
  // },

  async getGithub(_, _uuid) {
    const res = await github()
    postMessage({
      body: {
        code: 0,
        message: '',
        data: res
      },
      _uuid
    })
  },

  async initAdmin(_, _uuid) {
    const admin = await userController.initAdmin()
    postMessage({
      body: {
        code: 0,
        message: '',
        data: admin
      },
      _uuid
    })
  },

  async initWorkDir(_, _uuid) {
    const data = await workDirController.initWorkDir()
    postMessage({
      body: {
        code: 0,
        message: '',
        data
      },
      _uuid
    })
  },

  async login(query, _uuid) {
    await api.sLogin(query)
    postMessage({
      body: {
        code: 0,
        message: ''
      },
      _uuid
    })
  },

  async updateWorkDir(query, _uuid) {
    // console.log({ query })
    await api.sUpdateWorkDir(query)
    postMessage({
      body: {
        code: 0,
        message: ''
      },
      _uuid
    })
  },

  // for test
  async resetDir(_, _uuid) {
    await api.sResetDir()
    postMessage({
      body: {
        code: 0,
        message: ''
      },
      _uuid
    })
  },

  async getTxt(query, _uuid) {
    const data = await api.sGetTxt(query)
    postMessage({
      body: {
        code: 0,
        message: '',
        data
      },
      _uuid
    })
  },

  async setTxt(query, _uuid) {
    await api.sSetTxt(query)
    postMessage({
      body: {
        code: 0,
        message: ''
      },
      _uuid
    })
  },

  async getExcel(query, _uuid) {
    // console.log({ query })
    const data = await api.sGetExcel(query)
    postMessage({
      body: {
        code: 0,
        message: '',
        data
      },
      _uuid
    })
  },

  async setExcel(query, _uuid) {
    await api.sSetExcel(query)
    postMessage({
      body: {
        code: 0,
        message: ''
      },
      _uuid
    })
  }
}

// 后台: 前台 -> 后台
onmessage = ({ data: { method, query, _uuid } }) => {
  methods[method](query, _uuid).catch(err => {
    postMessage({
      body: {
        code: err.status || err.code || 999,
        message: err.message || '未处理错误'
      },
      _uuid
    })
  })
}
