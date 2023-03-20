/**
 * * 当前元素在区域内是否溢出
 * @param {element} node 当前节点
 * @param {element} area 区域节点
 * @param {object} offset 左右偏移量
 */
export const isOverflow = function({ cell, wrapper, leftWidth, rightWidth, overflowX, overflowY }) {
  const wrapperRect = wrapper.getBoundingClientRect()
  const { left, top, right, bottom } = wrapperRect
  const cellRect = cell.getBoundingClientRect()
  const { left: nodeLeft, top: nodeTop, right: nodeRight, bottom: nodeBottom } = cellRect
  const ovrflow = {}
  if (overflowX) {
    ovrflow.left = left + leftWidth - nodeLeft > 2
    ovrflow.right = right - nodeRight - rightWidth <= (overflowX ? 17 : 0)
  }
  if (overflowY) {
    ovrflow.top = (nodeTop - top) < -2
    ovrflow.bottom = bottom - nodeBottom <= (overflowY ? 17 : 0)
  }
  // console.log({ left, top, right, bottom })
  // console.log({ nodeLeft, nodeTop, nodeRight, nodeBottom })
  return ovrflow
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
