
import { ipcRenderer } from 'electron'

const ipc = {
  send(msg) {
    return new Promise(resolve => {
      const { key } = msg
      const time = Date.now()
      const keyTime = `${key}-${time}`

      msg.keyTime = keyTime

      ipcRenderer.once(keyTime, (_, msg) => {
        resolve(msg.body)
      })

      ipcRenderer.send('msg', msg)
    })
  }
}

export default ipc
