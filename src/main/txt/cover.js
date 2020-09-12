
import fs from 'fs'
import coverStr from '../../util/coverStr.js'

const read = filepath => {
  return new Promise((resolve, reject) => {
    let readStream = fs.createReadStream(filepath)
    let chunks = []

    // Handle any errors while reading
    readStream.on('error', err => {
      // File could not be read
      reject(err)
    })

    // Listen for data
    readStream.on('data', chunk => {
      chunks.push(chunk)
    })

    // File is done being read
    readStream.on('close', () => {
      // Create a buffer of the image from the stream
      resolve(Buffer.concat(chunks).toString('utf8'))
    })
  })
}

const cover = async (filepath, name) => {
  const str = await read(filepath)

  // console.log({ name })
  // console.log(str)

  const { head, excelCount, send, total, discount, list } = coverStr(str)

  return { name, head, excelCount, send, discount, total, list }
}

export default cover
