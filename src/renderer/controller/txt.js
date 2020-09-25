
import txtService from '../service/txt.js'

const txtController = {
  async getTxt (key) {
    const value = await txtService.find(key)
    return value
  },

  async setTxt (key, value) {
    await txtService.update(key, value)
  }
}

export default txtController
