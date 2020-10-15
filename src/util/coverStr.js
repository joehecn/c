/*
落單編號
地區
稱呼
送貨地址
手機號碼
送貨時段
取貨位置

已選
*/
import fun from './fun.js'
const { createErr, accMul } = fun

const getIndex = (headKeys, keyStr) => {
  for (let i = 0, len = headKeys.length; i < len; i++) {
    const key = headKeys[i]
    if (keyStr.indexOf(key) === 0) {
      return i
    }
  }

  return -1
}
const coverFirst = first => {
  const headArr = [
    '落單編號',
    '地區',
    '稱呼',
    '送貨地址',
    '手機號碼',
    '送貨時段',
    '取貨位置'
  ]
  const headKeys = [...headArr]
  // const head = []
  const headObj = {}
  let listCount = 0
  let send = 0
  for (let i = 0, len = first.length; i < len; i++) {
    const keyStr = first[i]
    const index = getIndex(headKeys, keyStr)
    if (index === -1) {
      if (keyStr.indexOf('已選') === 0) {
        listCount = parseInt(keyStr.split('(')[1])
      }
      continue
    }
    const key = headKeys.splice(index, 1)[0]
    const item = [`${key}:`]
    i++
    const value = first[i].replace('\r', '')
    // console.log({ key, index, value })
    if (value) {
      item.push(value)

      if (key === '取貨位置') {
        const _s = value.split('($')[1]

        if (_s) {
          const p = parseFloat(_s.trim())
          const pp = accMul(p, 100)
          send = pp || 0
        }
      }
    }

    headObj[key] = item
    i++
  }

  const head = headArr.map(key => {
    return headObj[key] || [`${key}:`]
  })
  head.push([''])

  // console.log({ head, send, listCount })
  return { head, send, listCount }
}
const getHKY = price => {
  if (price === undefined) return 0

  const p = parseFloat(price.replace('HK$', '').trim())
  const pp = accMul(p, 100)
  // console.log({ price, p, pp })
  return pp
}
const coverIts = its => {
  const [, zh, en, price, unitStr] = its
  const count = parseFloat(unitStr)
  const len = count.toString().length
  const unit = unitStr.substr(len)
  const totalPrice = getHKY(price)
  const unitPrice = totalPrice / count
  return [zh, en, unit, unitPrice, count, totalPrice]
}
const coverStr = str => {
  // console.log('coverStr')
  const discount = 0

  const arr = str.split('-----------------------')

  const first = arr[0].split('\n')
  const { head, send, listCount } = coverFirst(first)

  const len = arr.length
  const list = []
  let count = 0
  let excelCount = 0
  let total = 0
  for (let i = 1; i < len - 1; i++) {
    const item = arr[i]
    const its = item.split('\n')
    const cover = coverIts(its)
    // console.log({ cover })

    count ++
    excelCount += cover[4]
    total += cover[5]

    list.push(cover)
  }

  // console.log({ listCount, count })
  if (listCount !== count) {
    // console.log(list)
    throw createErr(201, 'Error list count')
  }

  const last = arr[len - 1].split('\n')
  const listTotal = getHKY(last[3])

  // console.log({ listTotal, total })
  if (listTotal !== (total + discount + send)) {
    // console.log(listTotal, total, send)
    throw createErr(301, 'Error list total')
  }

  return { head, excelCount, send, discount, total, list }
}

export default coverStr
