
/**
 * 同步单例模式
 * c 消息机制，解偶模块
 *
 * example:
 * // 发消息
 * cEmitter.emit(id, res)
 */

import EventEmitter from 'events'

class CEmitter extends EventEmitter {}

const cEmitter = new CEmitter()

// TODO: 处理错误事件
cEmitter.on('error', err => {
  // console.error('---- cEmitter error ----')
  console.error(err)
})

export default cEmitter
