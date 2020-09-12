import workDirService from '../service/workDir.js'
import store from '../store/index.js'

const workDirController = {
  // async findWorkDir () {
  //   const workDir = await workDirService.find('workDir')

  //   return workDir
  // },

  async initWorkDir () {
    let workDir = await workDirService.find('workDir')
    // console.log({ admin })

    if (workDir) {
      store.commit('setWorkDir', workDir)
    }

    return workDir
  },

  async updateWorkDir (workDir) {
    if (workDir) {
      await workDirService.update('workDir', workDir)
      store.commit('setWorkDir', workDir)
    }
  },

  async removeWorkDir () {
    await workDirService.remove('workDir')
    store.commit('setWorkDir', '')
  }
}

export default workDirController
