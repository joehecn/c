
<template>
  <j-layout active="/config">
    <div class="config-form">

      <el-input
        class="config-form-item"
        placeholder="Please select a work directory"
        :value="workDir"
        disabled>
      </el-input>

      <el-button
        class="config-form-item"
        type="primary"
        @click="selectDir">Select work directory</el-button>
      <!-- for test -->
      <!-- <el-button
        class="config-form-item"
        @click="resetDir">Reset</el-button> -->
    </div>
  </j-layout>
</template>

<script>
import JLayout from '../components/JLayout.vue'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'j-layout': JLayout,
  },

  computed: {
    ...mapState({
      workDir: state => state.workDir
    })
  },

  methods: {
    ...mapActions([
      'setWorkDir'
    ]),

    async selectDir () {
      const msg = {
        key: 'selectDir',
        req: {}
      }

      if (this.workDir) {
        msg.req.defaultPath = this.workDir
      }

      const { code, message, data } = await this.$$back.sendIpc(msg)

      if (code !== 0) return

      const { canceled, filePaths } = data

      if (canceled) return

      const workDir = filePaths[0]

      if (!workDir) return

      const res = await this.$$back.sendWork('updateWorkDir', workDir)

      if (res.code !== 0) return

      this.setWorkDir(workDir)
      this.$router.push('/')
    }

    // // for test
    // async resetDir () {
    //   const { code, message } = await this.$$back.sendWork('resetDir')
    //   if (code === 0) {
    //     this.setWorkDir('')
    //   } else {
    //     this.$notify.error({
    //       position: 'bottom-left',
    //       title: code,
    //       message
    //     })
    //   }
    // }
  }
}
</script>

<style scoped>
.config-form {
  padding: 16px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
}

.config-form-item {
  margin-top: 16px;
}
</style>
