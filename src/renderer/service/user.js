
import db from '../db/index.js'

const name = 'c'
const storeName = 'user'

const userService = {
  async find (userName) {
    const user = await db('get', {
      name,
      storeName,
      key: userName
    })

    return user
  },

  async add (userName, password) {
    await db('set', {
      name,
      storeName,
      key: userName,
      value: {
        userName,
        password
      }
    })
  },

  async update (userName, password) {
    await this.add(userName, password)
  }
}

export default userService
