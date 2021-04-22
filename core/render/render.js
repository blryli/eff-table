import { render } from './'
import map from './map'
import isObject from 'xe-utils/isObject'
import isArray from 'xe-utils/isArray'

function getChildren(h, children, params) {
  if (children) {
    if (typeof children === 'function') {
      children(h, params)
    } else if (isArray(children)) {
      return children.map((child, idx) => {
        if (typeof child === 'function') {
          return child(h, params)
        } else if (isObject(child)) {
          const { name, children } = child
          const childrenRender = getChildren(h, children, params)
          const opts = Object.assign({}, child, { name: map.get(name), key: idx, children: childrenRender })
          return render(h, opts, params).render()
        }
        return child
      })
    } else if (isObject(children)) {
      const opts = Object.assign({}, children, { name: map.get(children.name) })
      return render(h, opts, params).render
    }
  }

  return children
}

export default {
  name: 'VRender',
  props: {
    config: { type: Object, default: () => {} },
    context: { type: Object, default: () => {} }
  },
  render(h) {
    const { config, context, $slots } = this
    const { name, children } = config

    const opts = Object.assign({}, config, { defaultSlot: $slots.default, name: map.get(name), children: getChildren(h, children, context) })
    console.log(opts)
    return render(h, opts, context).render()
  }
}
