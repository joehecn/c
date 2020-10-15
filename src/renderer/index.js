
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

import back from './frontend/back.js'

import { version } from '../../package.json'

import fun from '../util/fun.js'
import { shell } from 'electron'

import { ipcRenderer } from 'electron'
import { ebtRenderer } from 'electron-baidu-tongji'

const { checkVersion } = fun
window.JOE_GLOBAL_SHELL = shell
// 百度统计 siteId
const BAIDU_SITE_ID = 'f3b6b71c1bc16c915445fd90679f9934'


Vue.prototype.$$moment = moment
Vue.prototype.$$back = back

// Vue.prototype.$$echarts = echarts

/**
 * 关闭生产模式下给出的提示
 */
Vue.config.productionTip = false

document.title = `c ${version}`

/**
 * 检查版本
 */
back.sendWork('getGithub').then(({ code, message, data }) => {
  // console.log({ code, message, data })
  if (code !== 0) {
    Vue.prototype.$notify.warning({
      position: 'top-right',
      title: '检查更新失败',
      message: message || 'fail'
    })
    return
  }

  store.commit('setGithub', data)
  const checked = checkVersion(data.tag_name, version)
  if (checked === 0) {
    // 0 - 大版本升级 强制更新：一般是修复重大 BUG
    router.replace('github')
  } else if (checked === 1) {
    // 1 - 小版本升级 提示更新
    Vue.prototype.$notify({
      title: '提示',
      dangerouslyUseHTMLString: true,
      message: `<strong>有新版本(${data.tag_name}): <a href="javascript:void(0);" onclick="JOE_GLOBAL_SHELL.openExternal('${data.html_url}');return false;">点击链接查看详情</a></strong>`,
      duration: 0
    })
  }
})

// init admin
back.sendWork('initAdmin')
  // .then(({ code, message, data }) => {
  //   console.log({ code, message, data })
  // })

// init work directory
back.sendWork('initWorkDir')
  .then(({ data }) => {
    // console.log({ code, message, data })
    if (data) {
      store.commit('setWorkDir', data)
    }
  })

// 百度统计
ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
