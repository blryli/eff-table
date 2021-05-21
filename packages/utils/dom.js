import XEUtils from 'xe-utils'
/**
 * 防抖函数
 * @param fn 事件触发的操作
 * @param duration 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
export function debounce(fn, duration = 200) {
  let timer = null
  return function() {
    const self = this
    const args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(self, args)
    }, duration)
  }
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler, options = false) {
      if (element && event && handler) {
        element.addEventListener(event, handler, options)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})(document)

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler, options = false) {
      if (element && event) {
        element.removeEventListener(event, handler, options)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})(document)

const trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export function addClass(el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

/**
 * * 获取节点 getBoundingClientRect
 * @param {节点} target
 */
export const getDomClientRect = function(target) {
  if (!target) console.error('获取id节点失败')
  const { top, bottom, left, right, width: targetWidth, height: targetHeight } = target.getBoundingClientRect()
  const width = targetWidth || right - left
  const height = targetHeight || bottom - top
  return {
    width,
    height,
    top,
    right,
    bottom,
    left,
    centerX: left + width / 2,
    centerY: top + height / 2
  }
}

/**
 * 删除dom节点
 * @param {content} self
 * @param {node ref} ref
 */
export const removeBody = function(self, ref) {
  const pos = self.$refs[ref]
  if (pos && pos.$el && pos.$el.parentNode === document.body) {
    document.body.removeChild(pos.$el)
  } else if (pos && pos.parentNode === document.body) {
    document.body.removeChild(pos)
  }
}

export const getCell = (event) => {
  let cell = event.target

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (hasClass(cell, 'eff-table__column')) {
      return cell
    }
    cell = cell.parentNode
  }

  return null
}

/**
 * * 计算鼠标移动距离
 * @param {object} functions
 */
export const onMousemove = function(fns) {
  const { start, moveing, end } = fns
  start && start()

  let startX = 0
  let moveX = 0
  let startY = 0
  let moveY = 0

  document.onselectstart = function() { return false }
  document.ondragstart = function() { return false }

  const handleMouseMove = (e) => {
    if (e) {
      !startX && (startX = e.clientX)
      !startY && (startY = e.clientY)
      moveX = e.clientX - startX
      moveY = e.clientY - startY
    }

    moveing && moveing(moveX, moveY)
  }

  const handleMouseUp = () => {
    end && end(moveX, moveY)

    off(document, 'mousemove', handleMouseMove)
    off(document, 'mouseup', handleMouseUp)
    document.onselectstart = null
    document.ondragstart = null
  }
  on(document, 'mousemove', handleMouseMove)
  on(document, 'mouseup', handleMouseUp)
}

/**
 * * 获取节点文本宽度
 * @param {node} node
 */
export const getTextWidth = function(node) {
  function getStyle(elem, prop) {
    return window.getComputedStyle(elem, null).getPropertyValue(prop)
  }
  const range = document.createRange()
  range.setStart(node, 0)
  range.setEnd(node, node.childNodes.length)
  const rangeWidth = range.getBoundingClientRect().width
  const padding = parseInt(getStyle(node, 'padding-left')) + parseInt(getStyle(node, 'padding-right'))
  return padding + rangeWidth
}

/**
     * 单元格的值为：'' | null | undefined 时都属于空值
     */
export const eqCellNull = function(cellValue) {
  return cellValue === '' || XEUtils.eqNull(cellValue)
}

export const eqCellValue = function(row1, row2, field) {
  const val1 = XEUtils.get(row1, field)
  const val2 = XEUtils.get(row2, field)

  if (eqCellNull(val1) && eqCellNull(val2)) {
    return true
  }
  if (XEUtils.isString(val1) || XEUtils.isNumber(val1)) {
    /* eslint-disable eqeqeq */
    return val1 == val2
  }
  return XEUtils.isEqual(val1, val2)
}

