import { getOneChildComponent, on, off } from 'pk/form/utils/dom'

var defaultFocusOptions = {
  prevKeys: 'shift+enter',
  nextKeys: 'enter',
  skips: [],
  loop: true
}

export default {
  data() {
    return {
      formItems: Object.freeze([]),
      curprop: null,
      placement: null
    }
  },
  created() {
    const { focusOpen, lineSlotChange, onFocus, onBlur, keyup, click } = this
    this.$on('form-item-change', lineSlotChange)
    if (focusOpen) {
      this.$on('on-focus', onFocus)
      this.$on('on-blur', onBlur)

      on(window, 'keyup', keyup)
      on(window, 'click', click)
    }
  },
  beforeDestroy() {
    const { focusOpen, lineSlotChange, onFocus, onBlur, keyup, click } = this
    this.$off('form-item-change', lineSlotChange)
    if (focusOpen) {
      this.$off('on-focus', onFocus)
      this.$off('on-blur', onBlur)

      off(window, 'keyup', keyup)
      off(window, 'click', click)
    }
  },
  computed: {
    focusCtrl() {
      return { ...defaultFocusOptions, ...this.focusOptions }
    },
    prevKeys() {
      if (!this.focusCtrl.prevKeys) return ''
      return this.focusCtrl.prevKeys.toLowerCase().split('+').sort().toString()
    },
    nextKeys() {
      if (!this.focusCtrl.prevKeys) return ''
      return this.focusCtrl.nextKeys.toLowerCase().split('+').sort().toString()
    },
    revformItems() {
      return [...this.formItems].reverse()
    },
    formItemsProp() {
      return this.formItems.map(d => d.prop)
    }
  },
  methods: {
    lineSlotChange(obj) {
      const formItems = [...this.formItems]
      const index = formItems.findIndex(d => d.prop === obj.prop)
      if (obj.type === 'push') {
        index < 0 ? formItems.push(obj) : formItems.splice(index, 1, obj)
      } else {
        formItems.splice(index, 1)
        const i = this.validators.findIndex(d => d.prop === obj.prop)
        i > -1 && this.validators.splice(i, 1)
      }
      this.formItems = Object.freeze(formItems)
      // console.log(JSON.stringify(this.formItems.map(d => d.prop), null, 2))
    },
    onFocus(prop) {
      this.focusTimer = setTimeout(() => {
        this.curprop = prop
        this.$emit('focus', prop)
      }, 50)
    },
    onBlur(prop) {
      this.$emit('blur', prop)
      this.focusTimer = null
    },
    _clear() {
      this.curprop = null
    },
    click(e) {
      const { curprop, formItems, _clear } = this
      if (!curprop) return
      !formItems.find(d => d.slot.$el.contains(e.target)) && _clear()
    },
    keyup(e) {
      const { curprop, editIsStop, prevKeys, nextKeys, formItemsProp, prevFocus, nextFocus, focus } = this
      const keyStr = e.key || e.keyIdentifier
      if (!curprop || editIsStop || !keyStr) return
      const key = keyStr.toLowerCase()
      const keys = new Set()
      const keyArr = [{ key: 'alt', down: e['altKey'] }, { key: 'control', down: e['ctrlKey'] }, { key: 'shift', down: e['shiftKey'] }]
      keyArr.forEach(d => {
        d.down && keys.add(d.key.toLowerCase())
      })
      keys.add(key)
      const keysStr = Array.from(keys).sort().toString()
      keysStr === prevKeys && prevFocus(curprop) // 上一个
      keysStr === nextKeys && nextFocus(curprop) // 下一个

      // table上下键控制focus
      if (/\/\d\//.test(curprop)) {
        const getprop = sign => curprop.replace(/\/(\d)\//, (match, p1) => `/${+p1 + sign}/`)
        const prevprop = getprop(-1)
        const nextprop = getprop(1)
        keysStr === 'arrowup' && formItemsProp.includes(prevprop) && focus(prevprop)
        keysStr === 'arrowdown' && formItemsProp.includes(nextprop) && focus(nextprop)
      }
      this.$emit('keyup', keysStr, curprop, e)
    },
    prevFocus(curprop = this.curprop) {
      const { revformItems, nextNodeFocus } = this
      this.placement = 'left'
      nextNodeFocus(curprop, revformItems)
    },
    nextFocus(curprop = this.curprop) {
      const { formItems, nextNodeFocus } = this
      this.placement = 'right'
      nextNodeFocus(curprop, formItems)
    },
    nextNodeFocus(curprop, formItems) {
      const index = formItems.findIndex(d => d.prop === curprop) || 0
      if (index === -1) return
      let nextIndex
      const len = formItems.length
      const curConponent = getOneChildComponent(formItems[index].slot)

      const handleBlur = () => { // 处理失焦
        try {
          if (curConponent) {
            curConponent.blur && curConponent.blur()
            curConponent.handleClose && curConponent.handleClose()
          } else {
            const slotInput = formItems[index].input
            slotInput && slotInput.blur && slotInput.blur()
          }
        } catch (error) {
          console.error(error)
        }
      }

      for (let i = index + 1; i < len; i++) {
        const slot = formItems[i]
        if (this._isCanFocus(slot)) {
          nextIndex = i
          break
        }
      }

      // 如果下一个节点是最后一个或是剩下的节点存在，且都为不可操作的节点
      const { placement, data } = this
      if (index === len - 1 || nextIndex === undefined) {
        if (this.focusCtrl.loop) {
          nextIndex = formItems.findIndex(slot => this._isCanFocus(slot))
          this.$emit('loop', { prop: this.curprop, placement, data })
        } else {
          const event = placement === 'left' ? 'first-focused-node-prev' : 'last-focused-node-next'
          this.$emit(event, { prop: this.curprop, placement })
          this._clear()
          handleBlur()
          return
        }
      }

      const ev = placement === 'right' ? 'focus-prev' : 'focus-next'
      this.$emit(ev, { prop: this.curprop, placement })

      if (this.focusPause) return

      // 上一个节点失焦
      nextIndex !== index && handleBlur()

      try {
        const focusNode = this.getFocusNode(nextIndex, formItems)
        focusNode && focusNode.focus && focusNode.focus()
      } catch (error) {
        console.log(error)
      }
    },
    getFocusNode(index, formItems = this.formItems) {
      const nextSlot = formItems[index]
      const nextComponent = getOneChildComponent(nextSlot.slot)
      return nextSlot && (nextComponent || nextSlot.input)
    },
    // 如果节点存在，disabled 不为 true，并且不在跳过字段列表，则判断为可聚焦
    _isCanFocus(lineSlot) {
      const { prop, slot, input } = lineSlot
      const component = getOneChildComponent(slot)
      return (!prop || prop && !this.focusCtrl.skips.find(p => p === prop)) && (component && !component.disabled || !component && input && !input.disabled)
    },
    focus(prop) {
      this.getInput(prop).focus && this.getInput(prop).focus()
    },
    blur(prop) {
      this.getInput(prop).blur && this.getInput(prop).blur()
    },
    select(prop) {
      this.getInput(prop).select && this.getInput(prop).select()
    },
    getInput(prop) {
      const { formItems, _isCanFocus, getFocusNode } = this
      if (prop && !formItems.find(d => d.slot.prop === prop)) {
        console.error(`focus方法传入的prop [${prop}] 没有定义`)
      }
      const index = prop ? formItems.findIndex(d => d.prop === prop) : formItems.findIndex(d => _isCanFocus(d))
      if (index === -1) return
      return getFocusNode(index)
    }
  }
}
