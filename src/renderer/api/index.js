
import userController from '../controller/user.js'
import workDirController from '../controller/workDir.js'

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

  async sResetDir () {
    await workDirController.removeWorkDir()
  }
}

export default api
