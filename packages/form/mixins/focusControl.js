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
      lineSlots: Object.freeze([]),
      curPath: null,
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
    revLineSlots() {
      return [...this.lineSlots].reverse()
    },
    lineSlotsPath() {
      return this.lineSlots.map(d => d.path)
    }
  },
  methods: {
    lineSlotChange(obj) {
      const lineSlots = [...this.lineSlots]
      const index = lineSlots.findIndex(d => d.path === obj.path)
      index === -1 ? lineSlots.push(obj) : lineSlots.splice(index, 1, obj)
      this.lineSlots = Object.freeze(lineSlots)
      // console.log(JSON.stringify(this.lineSlots.map(d => d.path), null, 2))
    },
    onFocus(path) {
      setTimeout(() => {
        this.curPath = path
        this.$emit('focus', path)
      }, 50)
    },
    onBlur(path) {
      this.$emit('blur', path)
    },
    _clear() {
      this.curPath = null
    },
    click(e) {
      const { curPath, lineSlots, _clear } = this
      if (!curPath) return
      !lineSlots.find(d => d.slot.$el.contains(e.target)) && _clear()
    },
    keyup(e) {
      const { curPath, editIsStop, prevKeys, nextKeys, lineSlotsPath, prevFocus, nextFocus, focus } = this
      const keyStr = e.key || e.keyIdentifier
      if (!curPath || editIsStop || !keyStr) return
      const key = keyStr.toLowerCase()
      const keys = new Set()
      const keyArr = [{ key: 'alt', down: e['altKey'] }, { key: 'control', down: e['ctrlKey'] }, { key: 'shift', down: e['shiftKey'] }]
      keyArr.forEach(d => {
        d.down && keys.add(d.key.toLowerCase())
      })
      keys.add(key)
      const keysStr = Array.from(keys).sort().toString()
      keysStr === prevKeys && prevFocus(curPath) // 上一个
      keysStr === nextKeys && nextFocus(curPath) // 下一个

      // table上下键控制focus
      if (/\/\d\//.test(curPath)) {
        const getPath = sign => curPath.replace(/\/(\d)\//, (match, p1) => `/${+p1 + sign}/`)
        const prevPath = getPath(-1)
        const nextPath = getPath(1)
        keysStr === 'arrowup' && lineSlotsPath.includes(prevPath) && focus(prevPath)
        keysStr === 'arrowdown' && lineSlotsPath.includes(nextPath) && focus(nextPath)
      }
      this.$emit('keyup', keysStr, curPath, e)
    },
    prevFocus(curPath = this.curPath) {
      const { revLineSlots, nextNodeFocus } = this
      this.direction = 'prev'
      nextNodeFocus(curPath, revLineSlots)
    },
    nextFocus(curPath = this.curPath) {
      const { lineSlots, nextNodeFocus } = this
      this.direction = 'next'
      nextNodeFocus(curPath, lineSlots)
    },
    nextNodeFocus(curPath, lineSlots) {
      const index = lineSlots.findIndex(d => d.path === curPath) || 0
      if (index === -1) return
      let nextIndex
      const len = lineSlots.length
      const curConponent = getOneChildComponent(lineSlots[index].slot)

      const handleBlur = () => { // 处理失焦
        if (curConponent) {
          curConponent.blur && curConponent.blur()
          curConponent.handleClose && curConponent.handleClose()
        } else {
          const slotInput = lineSlots[index].input
          slotInput && slotInput.blur && slotInput.blur()
        }
      }

      for (let i = index + 1; i < len; i++) {
        const slot = lineSlots[i]
        if (this._isCanFocus(slot)) {
          nextIndex = i
          break
        }
      }

      // 如果下一个节点是最后一个或是剩下的节点存在，且都为不可操作的节点
      if (index === len - 1 || nextIndex === undefined) {
        if (this.focusCtrl.loop) {
          nextIndex = lineSlots.findIndex(slot => this._isCanFocus(slot))
        } else {
          const event = this.direction === 'prev' ? 'first-focused-node-prev' : 'last-focused-node-next'
          this.$emit(event, this.curPath)
          this._clear()
          handleBlur()
          return
        }
      }

      const ev = this.direction === 'prev' ? 'focus-prev' : 'focus-next'
      this.$emit(ev, this.curPath)

      if (this.focusPause) return

      // 上一个节点失焦
      nextIndex !== index && handleBlur()

      try {
        const focusNode = this.getFocusNode(nextIndex, lineSlots)
        focusNode && focusNode.focus && focusNode.focus()
      } catch (error) {
        console.error(error)
      }
    },
    getFocusNode(index, lineSlots = this.lineSlots) {
      const nextSlot = lineSlots[index]
      const nextComponent = getOneChildComponent(nextSlot.slot)
      return nextSlot && (nextComponent || nextSlot.input)
    },
    // 如果节点存在，disabled 不为 true，并且不在跳过字段列表，则判断为可聚焦
    _isCanFocus(lineSlot) {
      const { path, slot, input } = lineSlot
      const component = getOneChildComponent(slot)
      return (!path || path && !this.focusCtrl.skips.find(p => p === path)) && (component && !component.disabled || !component && input && !input.disabled)
    },
    focus(path) {
      this.getInput(path).focus && this.getInput(path).focus()
    },
    blur(path) {
      this.getInput(path).blur && this.getInput(path).blur()
    },
    select(path) {
      this.getInput(path).select && this.getInput(path).select()
    },
    getInput(path) {
      const { lineSlots, _isCanFocus, getFocusNode } = this
      if (path && !lineSlots.find(d => d.slot.path === path)) {
        console.error(`focus方法传入的path [${path}] 没有定义`)
      }
      const index = path ? lineSlots.findIndex(d => d.path === path) : lineSlots.findIndex(d => _isCanFocus(d))
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
