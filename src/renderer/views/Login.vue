
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

// // for test cEmitter
// import cEmitter from '../frontend/cEmitter.js'
// import { v4 as uuidv4 } from 'uuid'

export default {
  data() {
    return {
      userName: '',
      password: '',
      loading: false
    }
  },

  // // for test cEmitter
  // mounted() {
  //   console.log(uuidv4())
  //   console.log(uuidv4())

  //   const _id = uuidv4()
  //   cEmitter.once(_id, res => {
  //     console.log({ _id, res })
  //   })

  //   cEmitter.emit(_id, { test: 'cEmitter ok' })
  // },

  // // for test back
  // mounted() {
  //   this.$$back.sendWork('testOK', { arg: 'OK 1' }).then(res => {
  //     console.log('----- testOK', res)
  //   })

  //   this.$$back.sendWork('testError', { arg: 'ERROR 1' }).then(res => {
  //     console.log('----- testError', res)
  //   })

  //   this.$$back.sendWork('testOK', { arg: 'OK 2' }).then(res => {
  //     console.log('----- testOK', res)
  //   })

  //   this.$$back.sendWork('testError', { arg: 'ERROR 2' }).then(res => {
  //     console.log('----- testError', res)
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

        const { code, message } = await this.$$back.sendWork('login', {
          userName, password
        })
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
