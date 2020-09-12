
import db from '../db/index.js'

const name = 'c'
const storeName = 'workDir'

const workDirService = {
  async find (workDir) {
    const res = await db('get', {
      name,
      storeName,
      key: workDir
    })

    return res
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
  },

  async remove (key) {
    await db('remove', {
      name,
      storeName,
      key
    })
  }
}

export default workDirService
