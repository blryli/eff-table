import map from './map'
import isObject from 'xe-utils/isObject'
import isArray from 'xe-utils/isArray'

export function getChildren(h, children, params, key) {
  if (children) {
    if (typeof children === 'function') {
      const fn = children(h, params)
      if (fn.constructor.name === 'VNode') {
        return fn
      }
      return getChildren(h, fn, params)
    } else if (isArray(children)) {
      return children.map((child, idx) => {
        return getChildren(h, child, params, idx)
      })
    } else if (isObject(children)) {
      const { children: childs } = children
      const childrenRender = getChildren(h, childs, params)
      const opts = Object.assign({}, children, { key, children: childrenRender })
      return render(h, opts, params).render()
    }
    return children
  }

  return undefined
}

/**
 * 基础渲染函数
 */
class Render {
  constructor(h, renderOpts = {}, params = {}) {
    const { children } = renderOpts
    this.h = h
    this.params = params
    this.opts = renderOpts
    this.children = getChildren(h, children, params)
  }

  // 合并属性 外部传入属性 > 默认属性

  mergeOpts(opts) {
    for (const key in opts) {
      const opt = opts[key]
      this.opts[key] = Object.assign({}, opt, this.opts[key])
    }
    return this
  }

  // 设置opts属性
  setOpts(key, value) {
    this.opts[key] = value
    return this
  }
  // 设置opts属性
  set(key, value) {
    this[key] = value
    return this
  }

  render() {
    const { h, opts, children } = this
    const { name, tag, defaultSlot } = opts

    return h(tag || map.get(name), opts, [children, defaultSlot])
  }
}

export function render(h, renderOpts, params) {
  return new Render(h, renderOpts, params)
}
