
import userController from '../controller/user.js'
import workDirController from '../controller/workDir.js'
import txtController from '../controller/txt.js'

import fun from '../../util/fun.js'

const { createErr } = fun

const api = {
  async sLogin ({ userName, password }) {
    // console.log('sLogin')
    const user = await userController.findUser(userName)

    if (!(user && user.password === password)) {
      throw createErr(101, 'Error userName or password')
    }
  },

  async sUpdateWorkDir (workDir) {
    await workDirController.updateWorkDir(workDir)
  },

  // for test
  async sResetDir () {
    await workDirController.removeWorkDir()
  },

  // key: sourceName + sourceUnit
  async sGetTxt ({ sourceName, sourceUnit }) {
    const key = `${sourceName}|||${sourceUnit}`
    let value = await txtController.getTxt(key)

    if (!value) {
      value = {
        key,
        sourceName,
        sourceUnit,
        name: sourceName.split('(')[0].trim(),
        unit: sourceUnit,
        ratio: 1,
        choose: true
      }

      await txtController.setTxt(key, value)
    }

    return value
  },

  async sSetTxt(value) {
    const { key } = value
    await txtController.setTxt(key, value)
  }
}

export default api
