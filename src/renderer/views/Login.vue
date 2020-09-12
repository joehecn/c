
<template>
  <div id="login">
    <div class="login-form">
      <el-input
        class="login-form-item"
        placeholder="User Name"
        v-model="userName">
      </el-input>

      <el-input
        class="login-form-item"
        type="password"
        placeholder="Password"
        v-model="password">
      </el-input>

      <el-button
        class="login-form-item left"
        type="primary"
        :loading="loading"
        @click="login">login</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// import config from '../config/index.js'

export default {
  data() {
    return {
      userName: '',
      password: '',
      loading: false
    }
  },
  // computed: {
  //   ...mapState({
  //     loading: state => state.loading
  //   })
  // },
  methods: {
    ...mapActions([
      'setUser'
    ]),

    async login() {
      const userName = this.userName.trim()
      const password = this.password.trim()

      if (userName && password) {
        this.loading = true

        const msg = {
          key: 'login',
          req: {
            userName,
            password
          }
        }

        const { code, message } = await this.$$work.send(msg)
        // console.log({ code, message })
        if (code === 0) {
          this.setUser({ userName })
          this.$router.replace(this.$route.query.redirect || '/')
        } else {
          this.$notify.error({
            position: 'bottom-left',
            title: code,
            message
          })
        }

        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  padding: 16px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
}

.login-form-item {
  margin-top: 16px;
}

.login-form-item.left {
  align-self: flex-end;
}
</style>
