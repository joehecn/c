
const createErr = (code, message) => {
  const err = new Error(message)
  err.status = code
  err.code = code
  return err
}

const fixNumber = num => {
  const n = num / 100
  return Number(n.toFixed(2))
}

/**
 *
 * @param {*} tag_name: 线上版本
 * @param {*} version: 本地版本
 *
 * 2 - 版本一致 无需升级
 * 1 - 小版本升级 提示更新
 *    ：中间版本不同：一般是 有新功能增加
 *    ：末尾版本不同：一般是 不影响现有版本功能的小维护
 * 0 - 大版本升级 强制更新：一般是修复重大 BUG
 */
const checkVersion = (tag_name, version) => {
  // 1.0.0: 1.0.0
  if (tag_name === version) return 2 // 版本相同
  // 1.0.1 1.0.0
  // 1.1.0 1.0.0
  if (tag_name.split('.')[0] === version.split('.')[0]) return 1 // 小版本不同
  // 2.0.0 1.0.0
  return 0 // 大版本不同
}

export default {
  createErr,
  fixNumber,
  checkVersion
}
