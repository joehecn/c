
import workDirService from '../service/workDir.js'

const workDirController = {
  async initWorkDir () {
    let workDir = await workDirService.find('workDir')
    return workDir
  },

  async updateWorkDir (workDir) {
    if (workDir) {
      await workDirService.update('workDir', workDir)
    }
  },

  // for test
  async removeWorkDir () {
    await workDirService.remove('workDir')
  }
}

export default workDirController
