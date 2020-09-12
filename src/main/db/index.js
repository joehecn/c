
/** 数据库结构
 -- Uin 数据库
 ---- group 数据仓库
        { md5: { groupName, tos: { premd5: { NickName, RemarkName } } } }
        ...
 ---- msg 数据仓库
        { key: { Type, Content, premd5s: [] } }
        ...
 */

import localforage from 'localforage'
import fun from '../../util/fun.js'

const { createErr } = fun

const makeMethod = (methods, createErr) => {
  return async (method, arg) => {
    // console.log({ method, arg })
    try {
      /* istanbul ignore else */
      if (methods[method]) {
        const res = await methods[method](arg)
        return res
      }
    } catch (err) {
      console.log('---- db makeMethod() catch err')
      console.error({ err })
      throw createErr(1000, err.message || '数据库错误')
    }
  }
}

/**
 *
 * @param {*} name 数据库名称 - Uin
 * @param {*} storeName 数据仓库名称 - group | msg
 */
const getStore = (name, storeName) => {
  return localforage.createInstance({ name, storeName })
}

const methods = {
  async set ({ name, storeName, key, value }) {
    const store = getStore(name, storeName)
    await store.setItem(key, value)
  },

  async get ({ name, storeName, key }) {
    // console.log({ name, storeName, key })
    const store = getStore(name, storeName)
    // console.log(store.getItem)
    const item = await store.getItem(key)
    // console.log({ item })
    return item
  },

  async remove ({ name, storeName, key }) {
    const store = getStore(name, storeName)
    await store.removeItem(key)
  },

  /**
   * list
   *
   * @param {String} Uin
   * @returns {Array} [{ md5, groupName }]
   */
  async list ({ name, storeName }) {
    const store = getStore(name, storeName)

    let arr = []
    await store.iterate((value, key) => {
      arr.push({ key, value })
    })

    return arr
  }
}

export default makeMethod(methods, createErr)
