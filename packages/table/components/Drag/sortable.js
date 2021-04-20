import { on, off } from 'packages/table/utils/dom'

const config = {
  onEnd: () => {}
}

let relation = {
  fromIndex: null,
  toIndex: null,
  from: null,
  to: null,
  fromEl: null,
  toEl: null,
  clone: null,
  enterFrom: false,
  enterTo: false,
  fromGroup: null,
  toGroup: null
}

export default class Sortable {
  constructor(options) {
    this.options = { ...config, ...options }
    this.el = this.options.el
    this.dragEvents = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']
    this.downTarget = null
    this.init()
  }

  init() {
    on(this.el, 'mousedown', e => this.on_mousedown(e))
    on(this.el, 'mouseup', e => this.on_mouseup(e))

    this.dragEvents.forEach(event => {
      on(this.el, event, this[`on_${event}`].bind(this))
    })
  }

  destroy() {
    off(this.el, 'mousedown', e => this.on_mousedown(e))
    off(this.el, 'mouseup', e => this.on_mouseup(e))

    this.dragEvents.forEach(event => {
      off(this.el, event, this[`on_${event}`].bind(this))
    })
  }

  on_mousedown(e) {
    if (e.button === 0) {
      const target = this.getDragNode(e.target)
      if (this.isFilter(target) || target === this.el) return
      this.downTarget = target
      this.downTarget && this.downTarget.setAttribute('draggable', true)
    }
  }

  on_mouseup(e) {
    e.button === 0 && this.downTarget && this.downTarget.setAttribute('draggable', false)
  }
  /* 拖动目标元素时触发drag事件 */
  on_drag(e) {
    const { clientX, clientY } = e
    const { from, to } = relation
    if (from) {
      const { left, top, right, bottom } = from.getBoundingClientRect()
      relation.enterFrom = clientX > left && clientX < right && clientY > top && clientY < bottom
    } else {
      relation.enterFrom = false
    }
    if (to) {
      const { left, top, right, bottom } = to.getBoundingClientRect()
      relation.enterTo = clientX > left && clientX < right && clientY > top && clientY < bottom
    } else {
      relation.enterTo = false
    }
    const { enterFrom, enterTo } = relation
    this._emit('drag', { from, to, enterFrom, enterTo }, e)
  }

  on_dragstart(e) {
    const { target } = e
    relation.fromEl = target

    // 设置拖动开始区域 from
    relation.from = this.el
    relation.clone = target.cloneNode(true)
    relation.fromGroup = this.options.group
    const index = [...this.el.childNodes].findIndex(d => d === relation.fromEl)
    relation.fromIndex = index
    this._emit('dragstart', index, e)
  }

  on_dragend(e) {
    relation.fromEl.setAttribute('draggable', false)
    this._emit('dragend', e.target)
    const rest = {
      fromIndex: null,
      toIndex: null,
      from: null,
      to: null,
      fromEl: null,
      toEl: null,
      clone: null,
      enterFrom: false,
      enterTo: false
    }
    relation = { ...relation, ...rest }
  }

  /* 放置目标元素时触发事件 */
  on_dragover(e) {
    // 阻止默认动作以启用drop
    e.preventDefault()
    this._emit('dragover', e)
  }

  on_dragenter(e) {
    let { target } = e
    target = this.getDragNode(target)

    // 设置进入区域 to
    this.el.contains(target) && (relation.to = this.el)
    relation.toIndex = this.getToIndex(target)

    relation.toGroup = this.options.group
    if (!this.isSameGroup()) {
      return false
    }

    let { toEl } = relation
    if (!toEl || toEl && toEl !== target) {
      relation.toEl = toEl = target
      const { fromIndex, toIndex, from, to, fromEl } = relation
      const willInsertAfter = toIndex > fromIndex
      // console.log('进入', { fromIndex, toIndex, from, to, fromEl, toEl, willInsertAfter })

      this._emit('dragenter', { from, to, fromEl, toEl, willInsertAfter })
    }
  }

  on_dragleave(e) {
    const target = this.getDragNode(e.target)
    !this.isFilter(target) && this._emit('dragleave', { target })
  }

  on_drop(e) {
    e.preventDefault()
    if (!this.isSameGroup()) return false
    // 阻止默认动作（如打开一些元素的链接）
    // const target = this.getDragNode(e.target)

    // 获取交互的index
    const { fromIndex, toIndex, from, to, fromEl, toEl, clone } = relation
    // console.log({ fromIndex, toIndex, from, to, fromEl, toEl, clone })
    this._emit('onEnd', { fromIndex, toIndex, from, to, fromEl, toEl, clone })
  }

  _emit(name, param) {
    const event = this.options[name]
    event && event(param)
  }

  getToIndex(target) {
    const childNodes = [...relation.to.childNodes]
    const index = childNodes.findIndex(d => d === target)
    return childNodes.length && index > -1 ? index : 0
  }

  isFilter(target) {
    const { filter } = this.options
    const filters = [filter, 'is--space', 'eff-empty-text']
    return filters.find(d => target.classList.contains(d))
  }

  getDragNode(el) {
    if (!el || !el.parentNode) return false
    while (el.parentNode !== this.el && !el.contains(this.el)) {
      el = el.parentNode
    }
    return el
  }

  isSameGroup() {
    const { from, to, fromGroup, toGroup } = relation
    // console.log({ from, to, fromGroup, toGroup })
    return from === to || (fromGroup && fromGroup === toGroup)
  }
}
