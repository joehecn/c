<template>
  <div>
    <el-header>
        <j-head></j-head>
    </el-header>

    <el-container>
      <el-aside width="60px">
        <el-menu :router="true"
          :default-active="active">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <!-- <span slot="title">Home</span> -->
          </el-menu-item>
          <el-menu-item index="/config">
            <i class="el-icon-setting"></i>
            <!-- <span slot="title">Config</span> -->
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container style="overflow: hidden;">
        <el-main class="page-component__scroll">
          <slot></slot>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import JHead from './JHead.vue'

export default {
  components: {
    'j-head': JHead,
  },

  props: ['active']
}
</script>
