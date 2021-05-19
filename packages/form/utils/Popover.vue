<template>
  <transition name="fade">
    <div
      :id="placementId"
      class="v-popover"
      :class="popoClass"
      :style="popoverStyle"
      @mouseenter="mouseenterWrap"
      @mouseleave="mouseleaveWrap"
    >
      <div v-if="visibleArrow" class="v-popover__arrow" />
      <!-- <v-slot :data="data" /> -->
    </div>
  </transition>
</template>

<script>
// import VSlot from './Slot'
import {
  on,
  off,
  removeEventListener,
  getDomClientRect
} from 'utils/dom'

function $(params) {
  return document.getElementById(params)
}

export default {
  name: 'VPopover',
  // components: { VSlot },
  props: {
    referenceId: {
      type: String,
      required: true
    },
    // 需要监听的事件
    trigger: {
      type: String,
      default: 'hover'
    },
    effect: {
      type: String,
      default: 'dark'
    },
    borderColor: String,
    // popover消息提示
    data: [String, Object, Array],
    disabled: [Boolean, Number],
    placement: {
      type: String,
      default: 'top'
    },
    placementId: String,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    showAlways: Boolean,
    positions: {
      type: Array,
      default: () => []
    },
    enterable: Boolean,
    popoverClass: String,
    hideDelay: {
      type: Number,
      default: 200
    },
    prop: String
  },
  data() {
    return {
      reference: null,
      show: false,
      addedBody: false,
      timeoutPending: null,
      parentNodes: []
    }
  },
  inject: ['form'],
  computed: {
    isVisible() {
      return (this.showAlways || this.show) && !this.disabled
    },
    popoClass() {
      return `${this.effect ? `is-${this.effect}` : 'is-light'}  v-popover__${
        this.placement
      } ${this.popoverClass || ''} ${
        this.isVisible ? 'v-popover--visible' : 'v-popover--hidden'
      }`
    },
    popoverStyle() {
      const style = {
        '--borderColor': '#ccc',
        '--bgColor': '#fff'
      }
      if (typeof this.effect === 'string') {
        switch (this.effect) {
          case 'light':
            style['--borderColor'] = '#ccc'
            style['--bgColor'] = '#fff'
            break
          case 'dark':
            style['--borderColor'] = '#303133'
            style['--bgColor'] = '#303133'
            style['--color'] = '#fff'
            break
          case 'warn':
            style['--borderColor'] = '#e6a23c'
            style['--bgColor'] = '#e6a23c'
            style['--color'] = '#fff'
            break
          case 'error':
            style['--borderColor'] = '#f56c6c'
            style['--bgColor'] = '#f56c6c'
            style['--color'] = '#fff'
            break
          default:
            style['--borderColor'] = this.borderColor || this.effect
            style['--bgColor'] = this.effect
            style['--color'] = '#fff'
            break
        }
      }
      return style
    }
  },
  watch: {
    show(val) {
      if (this.showAlways) return
      if (val) {
        this.form.$emit('show', this.prop)
        this.popoverAddedBody()
        this.calcPosition()
      } else {
        this.form.$emit('hide', this.prop)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.reference = $(this.referenceId)
      // this.parentNodes = getParentNodes(this.reference);
      // enableEventListener(this.parentNodes, this.scrollChange);
      this.calcPosition()

      if (this.trigger === 'hover') {
        on(this.reference, 'mouseenter', this.doShow)
        on(this.reference, 'mouseleave', this.doHide)
      } else if (this.trigger === 'focus') {
        on(this.reference, 'focus', this.doShow)
        on(this.reference, 'blur', this.doHide)
      } else {
        on(window, 'click', this.triggerClick)
      }
    })
  },
  beforeDestroy() {
    removeEventListener(this.parentNodes, this.scrollChange)

    if (this.trigger === 'hover') {
      off(this.reference, 'mouseenter', this.doShow)
      off(this.reference, 'mouseleave', this.doHide)
    } else if (this.trigger === 'focus') {
      off(this.reference, 'focus', this.doShow)
      off(this.reference, 'blur', this.doHide)
    } else {
      off(window, 'click', this.triggerClick)
    }
    this.addedBody && document.body.removeChild(this.$el)
  },
  methods: {
    calcPosition() {
      !this.addedBody && this.popoverAddedBody()
      const popoverRect = getDomClientRect(this.$el)
      const referenceRect = getDomClientRect(this.reference)
      let top, left
      // 计算节点坐标
      switch (this.placement) {
        case 'top':
          left = referenceRect.centerX - popoverRect.width / 2
          top = referenceRect.top - popoverRect.height - 12
          break
        case 'left':
          left = referenceRect.left - popoverRect.width - 12
          top = referenceRect.centerY - popoverRect.height / 2
          break
        case 'right':
          left = referenceRect.right + 12
          top = referenceRect.centerY - popoverRect.height / 2
          break
        case 'bottom':
          left = referenceRect.centerX - popoverRect.width / 2
          top = referenceRect.bottom + 12
          break
        default:
          console.error('Wrong placement prop')
      }
      this.$el.style.top = top + 'px'
      this.$el.style.left = left + 'px'
    },
    popoverAddedBody() {
      if (!this.addedBody && (this.show || this.showAlways)) {
        document.body.appendChild(this.$el)
        this.addedBody = true
      }
    },
    triggerClick(e) {
      const popover = this.$el
      const trigger = this.reference
      if (!popover || !trigger || !e.target) return
      if (trigger.contains(e.target)) {
        !this.disabled && (this.show = !this.show)
      } else if (popover.contains(e.target)) {
        return
      } else {
        this.show = false
      }
    },
    doShow() {
      if (!this.disabled && this.trigger !== 'click') {
        if (this.timeoutPending) {
          clearTimeout(this.timeoutPending)
          this.show = true
        } else {
          this.show = true
        }
      }
    },
    doHide() {
      if (!this.disabled && this.trigger !== 'click') {
        this.timeoutPending = setTimeout(() => {
          this.show = false
        }, this.hideDelay)
      }
    },
    mouseenterWrap() {
      this.enterable && clearTimeout(this.timeoutPending)
    },
    mouseleaveWrap() {
      if (this.enterable && this.trigger !== 'click') {
        this.timeoutPending = setTimeout(() => {
          this.show = false
        }, 200)
      }
    },
    scrollChange() {
      if (this.isVisible) {
        this.calcPosition() // 可见的popover实时计算位置
      } else {
        // this.isMorePlacement && debounce(this.calcPosition)() // 不可见的popover,如果是多图层，位置计算开启节流
      }
    }
  }
}
</script>

<style scoped>
.v-popover {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: fixed;
  z-index: 3000;
  padding: 10px;
  line-height: 1.2;
  font-size: 14px;
  min-width: 10px;
  border-radius: 4px;
  border: 1px solid;
  background-color: var(--bgColor);
  border-color: var(--borderColor);
  color: var(--color);
}

.v-popover--visible {
  visibility: visible;
  opacity: 1;
}

.v-popover--hidden {
  visibility: hidden;
  opacity: 0;
}

.v-popover__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

.v-popover__arrow:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 5px solid transparent;
}

.v-popover__top .v-popover__arrow {
  border-top-color: var(--borderColor);
  margin-left: -6px;
  left: 50%;
  top: 100%;
}

.v-popover__top .v-popover__arrow:after {
  top: -6px;
  margin-left: -5px;
  border-top: 5px solid var(--bgColor);
}

.v-popover__right .v-popover__arrow {
  border-right-color: var(--borderColor);
  margin-top: -6px;
  left: -12px;
  top: 50%;
}

.v-popover__right .v-popover__arrow:after {
  left: -3px;
  margin-top: -5px;
  border-right: 5px solid var(--bgColor);
}

.v-popover__bottom .v-popover__arrow {
  border-bottom-color: var(--borderColor);
  margin-left: -6px;
  top: -12px;
  left: 50%;
}

.v-popover__bottom .v-popover__arrow:after {
  top: -3px;
  margin-left: -5px;
  border-bottom: 5px solid var(--bgColor);
}

.v-popover__left .v-popover__arrow {
  border-left-color: var(--borderColor);
  margin-top: -6px;
  left: 100%;
  top: 50%;
}

.v-popover__left .v-popover__arrow:after {
  right: -3px;
  margin-top: -5px;
  border-left: 5px solid var(--bgColor);
}
</style>
