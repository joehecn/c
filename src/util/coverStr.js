
import fun from './fun.js'
const { createErr } = fun

const accMul = (arg1, arg2) => {
  let m = 0
  let s1 = arg1.toString()
  let s2 = arg2.toString()

  try {
      m += s1.split('.')[1].length;
  } catch (e) {
    return 0
  }
  try {
      m += s2.split('.')[1].length;
  } catch (e) {
    return 0
  }

  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

const coverFirst = first => {
  console.log({ first })

  if (first.length === 8) {
    const [reginKey, reginValue,, pointKey, pointValue] = first
    const selected = first[6]
    const listCount = parseInt(selected.split('(')[1])
    // console.log({ listCount })
    let send = 0
    console.log({ pointValue })
    const _s = pointValue && pointValue.split('($')[1]
    if (_s) {
      const p = parseFloat(_s.trim())
      const pp = accMul(p, 100)
      send = pp || 0
    }

    return { head: [reginKey, reginValue, pointKey, pointValue], send, listCount }
  } else {
    const [reginKey, reginValue] = first

    const selected = first[first.length - 2]

    const listCount = parseInt(selected.split('(')[1])
    // console.log({ listCount })
    const pointKey = ''
    const pointValue = ''
    const send = 0

    return { head: [reginKey, reginValue, pointKey, pointValue], send, listCount }
  }
}
const getHKY = price => {
  if (price === undefined) return 0

  const p = parseFloat(price.replace('HK$', '').trim())
  const pp = accMul(p, 100)
  console.log({ price, p, pp })
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
  // TODO: 首單9折
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
    console.log(listTotal, total, send)
    throw createErr(301, 'Error list total')
  }

  return { head, excelCount, send, discount, total, list }
}

export default coverStr
