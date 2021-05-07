export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler, options = false) {
      if (element && event && handler) {
        element.addEventListener(event, function(e) {
          handler(e)
        }, options)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, function(e) {
          handler(e)
        })
      }
    }
  }
})()

// 解除绑定事件
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
})()

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

/**
 * 获取所有父节点
 * @param {documentElement} node
 */
export const getParentNodes = function(node) {
  const parentNodes = [window]
  while (node !== document.body) {
    parentNodes.push(node)
    if (!node.parentNode || node.parentNode.name) return parentNodes
    node = node.parentNode
  }
  return parentNodes
}

/**
 * 节点绑定 resize scroll 事件
 * @param {array} node
 * @param {function} handler
 */
export const enableEventListener = function(nodes, handler) {
  nodes.forEach(p => {
    p.addEventListener('resize', handler, {
      passive: true
    })
    p.addEventListener('scroll', handler, {
      passive: true
    })
  })
}

/**
 * 节点解绑 resize scroll 事件
 * @param {array} node
 * @param {function} handler
 */
export const removeEventListener = function(nodes, handler) {
  nodes.forEach(p => {
    p.removeEventListener('resize', handler)
    p.removeEventListener('scroll', handler)
  })
}

/**
 * * 获取节点 getBoundingClientRect
 * @param {节点} target
 */
export const getDomClientRect = function(target) {
  if (!target) console.error('获取id节点失败')
  const targetRect = target.getBoundingClientRect()
  const top = targetRect.top
  const bottom = targetRect.bottom
  const left = targetRect.left
  const right = targetRect.right
  const width = targetRect.width || right - left
  const height = targetRect.height || bottom - top
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
 * * 获取所有子节点 getChildNodes
 * @param {节点} node
 * @param {节点} names
 */
export const getChildNodes = function(node, names = ['TEXTAREA', 'INPUT', 'SELECT']) {
  // 1.创建全部节点的数组
  var allCN = []
  names.find(d => d === node.nodeName) && allCN.push(node)

  // 2.递归获取全部节点
  var getAllChildNodes = function(node, names, allCN) {
    // 获取当前元素所有的子节点nodes
    var nodes = node.childNodes
    // 获取nodes的子节点
    for (var i = 0; i < nodes.length; i++) {
      var child = nodes[i]
      // 判断是否为指定类型节点
      if (names.find(d => d === child.nodeName)) {
        allCN.push(child)
      }
      getAllChildNodes(child, names, allCN)
    }
  }
  getAllChildNodes(node, names, allCN)
  // 3.返回全部节点的数组
  return allCN
}

/**
 * * 判断节点是否可聚焦 isFocusNode
 * @param {element} node
 */
export const isFocusNode = function(node) {
  return ['TEXTAREA', 'INPUT', 'SELECT'].includes(node.nodeName)
}

/**
 * * 获取单个子元素 getOneChildElement
 * @param {element} startElement
 * @param {function} rule
 * @param {string} type
 */
export const getOneChildElement = function(startElement, rule, type = 'childNodes') {
  if (rule(startElement)) return startElement
  const getChidElement = function(element, rule) {
    const elements = element[type]
    if (!elements || !elements.length) return false
    for (let i = 0; i < elements.length; i++) {
      const child = elements[i]
      if (child.nodeName === '#comment') continue
      return rule(child) ? child : getChidElement(child, rule)
    }
  }
  return getChidElement(startElement, rule)
}

/**
 * * 获取单个子节点 getOneChildNode
 * @param {element} node
 * @param {function} rule
 */
export const getOneChildNode = (node, rule = isFocusNode) => getOneChildElement(node, rule)

/**
 * * 获取单个子组件 getOneChildComponent
 * @param {element} component
 * @param {function} rule
 */
export const getOneChildComponent = (component, rule = child => child.focus) => getOneChildElement(component, rule, '$children')

/**
 * * 获取所有子元素 getOneChildElement
 * @param {element} startElement
 * @param {function} rule
 * @param {string} type
 */
export const getAllChildElement = function(startElement, rule, type = 'childNodes') {
  const all = []
  if (rule(startElement)) return [startElement]
  const getChidElement = function(element, rule, all) {
    const elements = element[type]
    for (let i = 0; i < elements.length; i++) {
      const child = elements[i]
      if (child.nodeName === '#comment') continue
      rule(child) ? all.push(child) : getChidElement(child, rule, all)
    }
  }
  getChidElement(startElement, rule, all)
  return all
}

/**
 * * 获取单个子节点 getAllChildNode
 * @param {element} node
 * @param {function} rule
 */
export const getAllChildNode = (node, rule = isFocusNode) => getAllChildElement(node, rule)

/**
 * * 获取所有子组件 getAllChildComponent
 * @param {element} component
 * @param {function} rule
 */
export const getAllChildComponent = (component, rule = child => child.focus) => getAllChildElement(component, rule, '$children')
