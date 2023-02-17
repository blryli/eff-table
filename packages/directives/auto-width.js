import { addClass, getStyle, getTextWidth, on, off } from 'pk/utils/dom'

/**
 * 自动计算下拉框、文本框宽度
 * @param {Number} minWidth 最小宽度/120
 * @param {Number} maxWidth 最大宽度/1000
 * @param {Number} offset 偏移量/0
 * @param  <StoreSelect v-model="search" v-auto-width="{ minWidth: 120, maxWidth: 1000 }" multiple collapse-tags clearable filterable />
 */

const setWidth = (el, binding, width) => {
  const value = binding.value || {}
  const offset = value.offset || 0
  const minWidth = value.minWidth || 100
  const maxWidth = value.maxWidth || 1000
  el.style.minWidth = (width < minWidth ? minWidth : width > maxWidth ? maxWidth : width) + offset + 'px'
  el.style.maxWidth = (width < minWidth ? minWidth : width > maxWidth ? maxWidth : width) + offset + 'px'
}

const setMultiSelectWidth = (el, binding, vnode, isFilter) => {
  const tag = el.querySelector('.el-select__tags span')
  const width = tag ? getTextWidth(tag) + 50 + (isFilter && 30 || 0) : 1
  setWidth(el, binding, width)
}

const setInputWidth = (el, binding) => {
  const input = el.querySelector('input') || el
  const textNode = el.querySelector('.el-input__value-text')
  if (!textNode) {
    var div = document.createElement('div')
    div.setAttribute('class', 'el-input__value-text')
    div.style.paddingLeft = getStyle(input, 'padding-left')
    div.style.paddingRight = getStyle(input, 'padding-right')
    div.style.fontSize = getStyle(input, 'font-size')
    div.style.whiteSpace = 'nowrap'
    div.style.position = 'absolute'
    div.style.zIndex = '-100'
    el.appendChild(div)
    div.innerText = input.value || ''
  } else {
    textNode.innerText = input.value || ''
  }
  const width = input.value && textNode ? getTextWidth(textNode) + 10 : 1
  setWidth(el, binding, width)
}

const getHandles = (el, binding, vnode) => {
  const { componentInstance: { $attrs = {}, $options: { propsData } = {}} = {}, tag } = vnode
  const { multiple, filterable } = Object.assign({}, $attrs || {}, propsData)
  const multi = multiple !== undefined && multiple !== false
  const isFilter = filterable !== undefined && filterable !== false
  if (tag.indexOf('Select') > 0) {
    return multi ? { type: 'multiSelect', event: 'change', handle: () => setTimeout(() => setMultiSelectWidth(el, binding, vnode, isFilter)) } : { type: 'select', event: 'change', handle: () => setTimeout(() => setInputWidth(el, binding, vnode)) }
  }
  return { type: 'input', event: 'input', handle: () => setTimeout(() => setInputWidth(el, binding, vnode)) }
}

export default {
  name: 'auto-width',
  bind(el, binding, vnode) {
    const { componentInstance: component } = vnode

    const handles = getHandles(el, binding, vnode)
    component ? component.$on(handles.event, handles.handle) : on(el, handles.event, handles.handle)
  },
  inserted(el, binding, vnode) {
    const handles = getHandles(el, binding, vnode)
    handles.handle()
  },
  update(el, binding, vnode) {
    addClass(el, 'auto-width')
    const handles = getHandles(el, binding, vnode)
    handles.handle()
  },
  unbind(el, binding, vnode) {
    const { componentInstance: component } = vnode

    const handles = getHandles(el, binding, vnode)
    component ? component.$off(handles.event, handles.handle) : off(el, handles.event, handles.handle)
  }
}
