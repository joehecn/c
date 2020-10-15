
import { ipcRenderer } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import cEmitter from './cEmitter.js'
import worker from './worker.js'

const sendIpc = msg => {
  return new Promise(resolve => {
    const _uuid = uuidv4()
    msg._uuid = _uuid
    ipcRenderer.once(_uuid, (_, msg) => {
      resolve(msg.body)
    })

    ipcRenderer.send('msg', msg)
  })
}

const sendWork = (method, query) => {
  return new Promise(resolve => {
    const _uuid = uuidv4()

    cEmitter.once(_uuid, body => {
      resolve(body)
    })

    worker.postMessage({ method, query, _uuid })
  })
}

export default {
  sendIpc,
  sendWork
}
