/**
 * * 获取 table 当前节点上下左右的节点
 * @param {element} node 当前节点
 * @param {string} placement left/top/right/bottom
 */
export const getTableNode = function(node, placement) {
  if (['left', 'top', 'right', 'bottom'].indexOf(placement) < 0) {
    console.error('getTableNode(node, placement) 方法必须传入 placement 参数 left/top/right/bottom')
    return
  }

  const config = {
    top: 'previousSibling',
    left: 'previousSibling',
    right: 'nextSibling',
    bottom: 'nextSibling'
  }
  const sibling = config[placement]
  if (placement === 'top' || placement === 'bottom') {
    const parent = node.parentNode
    const nodeIndex = [...parent.childNodes].findIndex(d => d === node)
    const targetRow = parent[sibling]
    return targetRow ? targetRow.childNodes[nodeIndex] : false
  } else {
    return node[sibling] || false
  }
}

/**
 * * 当前元素在区域内是否溢出
 * @param {element} node 当前节点
 * @param {element} area 区域节点
 * @param {object} offset 左右偏移量
 */
export const isOverflow = function(node, area, offset = {}) {
  const { leftWidth = 0, rightWidth = 0 } = offset
  const areaRect = area.getBoundingClientRect()
  const { left, top, right, bottom } = areaRect
  const nodeRect = node.getBoundingClientRect()
  const { left: nodeLeft, top: nodeTop, right: nodeRight, bottom: nodeBottom } = nodeRect
  // console.log({ left, top, right, bottom })
  // console.log({ nodeLeft, nodeTop, nodeRight, nodeBottom })
  return {
    left: left + leftWidth - nodeLeft > 2,
    top: nodeTop - top < -2,
    right: right - nodeRight - rightWidth <= 17,
    bottom: bottom - nodeBottom <= 17
  }
}

/**
 * *抖动 (需要搭配样式一起使用)
 * @param {element} node 当前节点
 * @param {string} placement 抖动方向
 */
export const shake = function(node, placement = 'y') {
  const classes = 'is-shake--' + placement
  node.classList.add(classes)
  const timer = setTimeout(() => {
    node.classList.remove(classes)
    clearTimeout(timer)
  }, 200)
}
