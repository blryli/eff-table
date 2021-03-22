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
