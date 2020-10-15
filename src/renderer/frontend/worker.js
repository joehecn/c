
import Worker from './back.worker.js'
import cEmitter from './cEmitter.js'

const worker = new Worker()

// 前台: 后台 -> 前台
worker.onmessage = event => {
  const { _uuid, body } = event.data
  cEmitter.emit(_uuid, body)
}

export default worker
