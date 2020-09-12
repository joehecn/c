
import fs from  'fs'
import moment from 'moment'
import path from 'path'

// 获取 文件夹下一层的文件名
// 转 callback  为 Promise
const _getDir = filePath => {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

// 判断是否为 文件夹
// 获取 mtime 最后修改时间
// 转 callback  为 Promise
const _getInfo = filePath => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) reject(err)
      resolve({
        isDir: stats.isDirectory(),
        mtime: stats.mtime
      })
    })
  })
}

const _checkTxt = filename => {
  if (filename[0] === '.') return { checked: false }

  const suffix = filename.substr(-4).toLowerCase()
  if (suffix !== '.txt') return { checked: false }

  const name = filename.substr(0, filename.length - 4)
  return { checked: true, name }
}

// 递归得到文件夹下所有的文件路径
const txts = async (workDir, date) => {
  const fileArr = []

  const basepath = path.join(workDir, date)
  const files = await _getDir(basepath)

  for (let i = 0, len = files.length; i < len; i++) {
    const filename = files[i]
    const filepath = path.join(basepath, filename)
    const { isDir, mtime } = await _getInfo(filepath)

    if (!isDir) {
      // 如果不是隐藏文件
      const { checked, name } = _checkTxt(filename)
      if (checked) {
        fileArr.push({
          filepath,
          name,
          key: path.join(date, filename),
          mtime: moment(mtime).valueOf(),
          checked: 0
        })
      }
    }
  }

  return fileArr
}

export default txts
