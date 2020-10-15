
import userService from '../service/user.js'

const userController = {
  async findUser (userName) {
    const user = await userService.find(userName)
    return user
  },

  async initAdmin () {
    let admin = await userService.find('admin')
    // console.log({ admin })

    if (!admin) {
      await userService.add('admin', 'admin')
      admin = await userService.find('admin')
      // console.log('--- set admin')
      // console.log({ admin })
    }

    return admin
  }
}

export default userController
