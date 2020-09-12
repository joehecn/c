
import store from '../store/index.js'

const auth = {
  loggedIn() {
    return store.state.user.userName !== ''
  }
}

export default auth
