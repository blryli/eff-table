/**
 * * 获取对象类型
 * @param {params} params
 */
export const getType = function(params) {
  return Object.prototype.toString.call(params).match(/ (\w+)]/)[1]
}

/**
 * * 键盘组合键
 * @param {event} event
 */
export const getKeysStr = function(event) {
  if (!event) {
    console.error('getKeysStr(event) 方法必须传入 event 参数')
    return
  }
  const key = event.key.toLowerCase()
  const keys = new Set()
  const keyArr = [{ key: 'alt', down: event['altKey'] }, { key: 'control', down: event['ctrlKey'] }, { key: 'shift', down: event['shiftKey'] }]
  keyArr.forEach(d => {
    d.down && keys.add(d.key.toLowerCase())
  })
  keys.add(key)
  return Array.from(keys).sort().toString()
}

export function deepClone(obj) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }

  return result
}
