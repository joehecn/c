
import { dialog } from 'electron'
import txts from '../txt/txts.js'
import cover from '../txt/cover.js'

const methods = {
  // Select the work directory
  async selectDir (msg, win) {
    const { req: { defaultPath } } = msg
    const options = {
      title: 'Select the work directory',
      properties: ['openDirectory', 'createDirectory']
    }

    if (defaultPath) options.defaultPath = defaultPath
    const data = await dialog.showOpenDialog(win, options)

    msg.body = {
      code: 0,
      message: '',
      data
    }
  },

  async findTxtlist (msg, _) {
    const { req: { workDir, date } } = msg
    const data = await txts(workDir, date)
    // console.log(data)
    msg.body = {
      code: 0,
      message: '',
      data
    }
  },

  async coverTxt (msg, _) {
    const { req: { filepath, name } } = msg
    const data = await cover(filepath, name)

    msg.body = {
      code: 0,
      message: '',
      data
    }
  }
}

const ctrlMsg = async (msg, win) => {
  try {
    await methods[msg.key](msg, win)
  } catch (error) {
    console.error('---- ctrlMsg err:', error)
    const code = error.status || error.code || 1000001
    const message = error.message || 'unknown error 1000001'
    msg.body = { code, message }
  }
}

export default ctrlMsg
