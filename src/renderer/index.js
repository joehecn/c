
import moment from 'moment'
// // 引入 ECharts 主模块
// // 引入折线图
// // 引入提示框和标题组件等
// import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/dataZoom'
// import 'echarts/lib/component/toolbox'

import './element/index.js'

import Vue from 'vue'
import App from './App.vue'

import store from './store/index.js'
import router from './router/index.js'

import ipc from './ipc/index.js'
import work from './work/index.js'

import { version } from '../../package.json'
import github from './github/index.js'

import userController from './controller/user.js'
import workDirController from './controller/workDir.js'

import fun from '../util/fun.js'
import { shell } from 'electron'

import { ipcRenderer } from 'electron'
// import { ebtRenderer } from 'electron-baidu-tongji'
import baiduTonji from '../util/tongji.js'
const { ebtRenderer } = baiduTonji

const { checkVersion } = fun
window.JOE_GLOBAL_SHELL = shell
// 百度统计 siteId
const BAIDU_SITE_ID = 'f3b6b71c1bc16c915445fd90679f9934'


Vue.prototype.$$moment = moment
Vue.prototype.$$ipc = ipc
Vue.prototype.$$work = work
// Vue.prototype.$$echarts = echarts

/**
 * 关闭生产模式下给出的提示
 */
Vue.config.productionTip = false

document.title = `c ${version}`
/**
 * 检查版本
 */
github().then(res => {
  // console.log(res)
  store.commit('setGithub', res)
  const checked = checkVersion(res.tag_name, version)
  if (checked === 0) {
    // 0 - 大版本升级 强制更新：一般是修复重大 BUG
    router.replace('github')
  } else if (checked === 1) {
    // 1 - 小版本升级 提示更新
    Vue.prototype.$notify({
      title: '提示',
      dangerouslyUseHTMLString: true,
      message: `<strong>有新版本(${res.tag_name}): <a href="javascript:void(0);" onclick="JOE_GLOBAL_SHELL.openExternal('${res.html_url}');return false;">点击链接查看详情</a></strong>`,
      duration: 0
    })
  }
}).catch(err => {
  console.log('---- github() catch err')
  console.error(err)
})

// init admin
userController.initAdmin().then(/* console.log */)

// init work directory
workDirController.initWorkDir().then(/* console.log */)

// 百度统计
ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
