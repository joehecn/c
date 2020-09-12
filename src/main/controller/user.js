import userService from '../service/user.js'

const userController = {
  async initAdmin () {
    const admin = await userService.find('admin')
    // console.log({ admin })
    return admin
  }
}

export default userController
