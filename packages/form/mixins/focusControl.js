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
      itemSlots: Object.freeze([]),
      curprop: null,
      direction: null
    }
  },
  created() {
    const { focusOpen, lineSlotChange, onFocus, onBlur, keyup, click } = this
    if (focusOpen) {
      this.$on('line-slot-change', lineSlotChange)
      this.$on('on-focus', onFocus)
      this.$on('on-blur', onBlur)

      on(window, 'keyup', keyup)
      on(window, 'click', click)
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
    revItemSlots() {
      return [...this.itemSlots].reverse()
    },
    itemSlotsProp() {
      return this.itemSlots.map(d => d.prop)
    }
  },
  methods: {
    lineSlotChange(obj) {
      const itemSlots = [...this.itemSlots]
      const index = itemSlots.findIndex(d => d.prop === obj.prop)
      index === -1 ? itemSlots.push(obj) : itemSlots.splice(index, 1, obj)
      this.itemSlots = Object.freeze(itemSlots)
      // console.log(JSON.stringify(this.itemSlots.map(d => d.prop), null, 2))
    },
    onFocus(prop) {
      setTimeout(() => {
        this.curprop = prop
        this.$emit('focus', prop)
      }, 50)
    },
    onBlur(prop) {
      this.$emit('blur', prop)
    },
    _clear() {
      this.curprop = null
    },
    click(e) {
      const { curprop, itemSlots, _clear } = this
      if (!curprop) return
      !itemSlots.find(d => d.slot.$el.contains(e.target)) && _clear()
    },
    keyup(e) {
      const { curprop, editIsStop, prevKeys, nextKeys, itemSlotsProp, prevFocus, nextFocus, focus } = this
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
        keysStr === 'arrowup' && itemSlotsProp.includes(prevprop) && focus(prevprop)
        keysStr === 'arrowdown' && itemSlotsProp.includes(nextprop) && focus(nextprop)
      }
      this.$emit('keyup', keysStr, curprop, e)
    },
    prevFocus(curprop = this.curprop) {
      const { revItemSlots, nextNodeFocus } = this
      this.direction = 'prev'
      nextNodeFocus(curprop, revItemSlots)
    },
    nextFocus(curprop = this.curprop) {
      const { itemSlots, nextNodeFocus } = this
      this.direction = 'next'
      nextNodeFocus(curprop, itemSlots)
    },
    nextNodeFocus(curprop, itemSlots) {
      const index = itemSlots.findIndex(d => d.prop === curprop) || 0
      if (index === -1) return
      let nextIndex
      const len = itemSlots.length
      const curConponent = getOneChildComponent(itemSlots[index].slot)

      const handleBlur = () => { // 处理失焦
        if (curConponent) {
          curConponent.blur && curConponent.blur()
          curConponent.handleClose && curConponent.handleClose()
        } else {
          const slotInput = itemSlots[index].input
          slotInput && slotInput.blur && slotInput.blur()
        }
      }

      for (let i = index + 1; i < len; i++) {
        const slot = itemSlots[i]
        if (this._isCanFocus(slot)) {
          nextIndex = i
          break
        }
      }

      // 如果下一个节点是最后一个或是剩下的节点存在，且都为不可操作的节点
      if (index === len - 1 || nextIndex === undefined) {
        if (this.focusCtrl.loop) {
          nextIndex = itemSlots.findIndex(slot => this._isCanFocus(slot))
        } else {
          const event = this.direction === 'prev' ? 'first-focused-node-prev' : 'last-focused-node-next'
          this.$emit(event, this.curprop)
          this._clear()
          handleBlur()
          return
        }
      }

      const ev = this.direction === 'prev' ? 'focus-prev' : 'focus-next'
      this.$emit(ev, this.curprop)

      if (this.focusPause) return

      // 上一个节点失焦
      nextIndex !== index && handleBlur()

      try {
        const focusNode = this.getFocusNode(nextIndex, itemSlots)
        focusNode && focusNode.focus && focusNode.focus()
      } catch (error) {
        console.error(error)
      }
    },
    getFocusNode(index, itemSlots = this.itemSlots) {
      const nextSlot = itemSlots[index]
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
      const { itemSlots, _isCanFocus, getFocusNode } = this
      if (prop && !itemSlots.find(d => d.slot.prop === prop)) {
        console.error(`focus方法传入的prop [${prop}] 没有定义`)
      }
      const index = prop ? itemSlots.findIndex(d => d.prop === prop) : itemSlots.findIndex(d => _isCanFocus(d))
      if (index === -1) return
      return getFocusNode(index)
    }
  },
  beforeDestroy() {
    const { focusOpen, lineSlotChange, onFocus, onBlur, keyup, click } = this
    if (focusOpen) {
      this.$off('line-slot-change', lineSlotChange)
      this.$off('on-focus', onFocus)
      this.$off('on-blur', onBlur)

      off(window, 'keyup', keyup)
      off(window, 'click', click)
    }
  }
}
