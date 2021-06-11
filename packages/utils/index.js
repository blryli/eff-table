import XEUtils from 'xe-utils'
/**
 * * 获取对象类型
 * @param {params} params
 */
export const getType = function(params) {
  return Object.prototype.toString.call(params).match(/ (\w+)]/)[1]
}
/**
 * * 获取行主键
 * @param {params} params
 */
export const getRowId = function(table, row) {
  return row[table.rowId || '_rowId'] || ''
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

export const initField = (data, prop, vue) => {
  const props = prop.split('.').filter(d => d || d === 0)
  const set = (data, props) => {
    const [one, tow] = props
    // 第一个非数字
    if (XEUtils.isNaN(Number(one))) {
      if (tow) {
        // 第二个非数字
        if (XEUtils.isNaN(Number(tow))) {
          data[one] = {}
        } else {
          data[one] = []
        }
        set(data[one], props.slice(1))
      } else {
        vue.$set(data, one, null)
      }
    } else {
      // 第一个是数字
      data[one] = {}
      set(data[one], props.slice(1))
    }
  }
  if (props.length > 1) {
    set(data, props)
  } else {
    data[prop] === undefined && vue.$set(data, prop, null)
  }
  return data
}

export const getField = function(data, prop) {
  if (prop.indexOf('.') === -1) return { fieldData: data, fieldProp: prop }
  const props = prop.split('.').filter(d => d || d === 0)
  const len = props.length
  const da = props.reduce((acc, cur, index) => len - 1 === index ? acc : acc[cur] || acc, data)
  return { fieldData: da, fieldProp: props[len - 1] }
}
