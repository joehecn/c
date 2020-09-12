
<template>
  <div class="header-wrap">
    <div class="btn-logout-wrap">
      <el-button
        type="text"
        @click="logout">Logout</el-button>
    </div>

    <!-- <div class="title">Database Import Config</div> -->
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.header-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.btn-logout-wrap {
  width: 80px;
}

/* .title {
  flex: auto;
  text-align: right;
} */
</style>
