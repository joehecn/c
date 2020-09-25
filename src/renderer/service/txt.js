
import db from '../db/index.js'

const name = 'c'
const storeName = 'txt'

const txtService = {
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

export default txtService
