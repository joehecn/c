
import db from '../db/index.js'

const name = 'c'
const storeName = 'excel'

const excelService = {
  async find (key) {
    const txt = await db('get', {
      name,
      storeName,
      key
    })

    return txt
  },

  async add (key, value) {
    await db('set', {
      name,
      storeName,
      key,
      value
    })
  },

  async update (key, value) {
    await this.add(key, value)
  }
}

export default excelService
