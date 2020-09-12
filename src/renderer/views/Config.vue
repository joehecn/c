
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

      <!-- <el-button
        class="config-form-item"
        @click="resetDir">Reset</el-button> -->
    </div>
  </j-layout>
</template>

<script>
import JLayout from '../components/JLayout.vue'
import { mapState } from 'vuex'

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
    async selectDir () {
      const msg = {
        key: 'selectDir',
        req: {}
      }

      if (this.workDir) {
        msg.req.defaultPath = this.workDir
      }

      const { code, message, data } = await this.$$ipc.send(msg)
      if (code === 0) {
        // console.log(data)
        const { canceled, filePaths } = data
        // console.log({ data, canceled, filePaths })
        if (!canceled) {
          const workDir = filePaths[0]
          // console.log({ workDir })
          if (workDir) {
            const msg = {
              key: 'updateWorkDir',
              req: {
                workDir
              }
            }
            await this.$$work.send(msg)
            this.$router.push('/')
          }
        }
      }
    },

    async resetDir () {
      const msg = {
        key: 'resetDir',
        req: {}
      }

      await this.$$work.send(msg)
    }
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
