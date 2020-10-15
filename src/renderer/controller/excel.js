
import excelService from '../service/excel.js'

const excelController = {
  async getExcel (key) {
    const value = await excelService.find(key)
    return value
  },

  async setExcel (key, value) {
    await excelService.update(key, value)
  }
}

export default excelController
