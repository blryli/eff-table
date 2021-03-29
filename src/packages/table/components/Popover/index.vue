<script>
import { removeBody, getDomClientRect } from '../../utils/dom'
import { h, Transition } from 'vue'

export default {
  name: 'Popover',
  props: {
    effect: { type: [String, Object], default: 'light' },
    // popover消息提示
    data: { type: [String, Object, Array], default: '' },
    placement: { type: String, default: 'top' },
    borderColor: { type: String, default: '#ccc' },
    popoverClass: { type: String, default: '' },
    trigger: { type: String, default: 'hover' },
    reference: HTMLDivElement,
    message: { type: [String, Array], default: '' },
    enterable: Boolean,
    hideDelay: { type: Number, default: 200 }
  },
  data() {
    return {
      show: false,
      addedBody: false,
      momentPlacement: this.placement
    }
  },
  computed: {
    pClass() {
      const { effect, show, momentPlacement, popoverClass } = this
      return `${effect ? `is-${effect}` : 'is-light'}  eff-table__popover-${momentPlacement} ${popoverClass} ${show ? 'eff-table__popover--visible' : 'eff-table__popover--hidden'}`
    },
    popoverStyle() {
      const { effect } = this
      const style = {
        '--borderColor': '#ccc',
        '--bgColor': '#fff',
        '--color': '#303133'
      }
      if (!effect) {
        return style
      }
      if (typeof effect === 'string') {
        switch (effect) {
          case 'light':
            style['--borderColor'] = '#ccc'
            style['--bgColor'] = '#fff'
            style['--color'] = '#303133'
            break
          case 'dark':
            style['--borderColor'] = '#303133'
            style['--bgColor'] = '#303133'
            style['--color'] = '#fff'
            break
          case 'info':
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
            style['--borderColor'] = effect
            style['--bgColor'] = effect
            style['--color'] = '#fff'
            break
        }
      } else if (typeof effect === 'object') {
        if (Array.isArray(effect)) {
          console.error('effect 只能是对象或字符串')
        } else {
          style['--borderColor'] = effect.borderColor
            ? effect.borderColor
            : '#ccc'
          style['--bgColor'] = effect.backgroundColor
            ? effect.backgroundColor
            : '#fff'
          style['--color'] = effect.color ? effect.color : '#303133'
        }
      } else {
        console.error('effect 只能是对象或字符串')
      }
      return style
    }
  },
  watch: {
    show(val) {
      if (val) {
        setTimeout(() => {
          this.popoverAddedBody()
          this.calculateCoordinate()
        }, 0)
      }
    }
  },
  mounted() {
  },
  beforeUnmount() {
    this.addedBody && removeBody(this, 'popover')
  },
  deactivated() {
    this.addedBody && removeBody(this, 'popover')
    this.addedBody = false
  },
  methods: {
    popoverAddedBody() {
      const { addedBody, show, $el } = this
      if (!addedBody && show) {
        document.body.appendChild($el)
        this.addedBody = true
      }
    },
    doShow() {
      const { timeoutPending } = this
      if (timeoutPending) {
        clearTimeout(timeoutPending)
        this.show = true
      } else {
        this.show = true
      }
    },
    doHide() {
      if (this.enterable) {
        this.timeoutPending = setTimeout(() => {
          this.show = false
        }, this.hideDelay)
      } else {
        this.show = false
      }
    },
    mouseenterWrap() {
      const { enterable, timeoutPending } = this
      enterable && clearTimeout(timeoutPending)
    },
    mouseleaveWrap() {
      if (this.enterable) {
        this.timeoutPending = setTimeout(() => {
          this.show = false
        }, 200)
      }
    },
    calculateCoordinate() {
      const { addedBody, $el, reference, momentPlacement, popoverAddedBody, changeDirection } = this
      !addedBody && popoverAddedBody()
      const popover = $el
      const referenceRect = getDomClientRect(reference)
      const popoverRect = getDomClientRect(popover)

      changeDirection(popoverRect, referenceRect)

      let top
      const left = referenceRect.centerX - (popoverRect.width / 2)
      switch (momentPlacement) {
        case 'top':
          top = referenceRect.top - popoverRect.height - 10
          break
        case 'bottom':
          top = referenceRect.bottom + 10
          break

        default:
          console.error('Wrong placement must top/bottom')
          break
      }
      popover.style.left = left + 'px'
      popover.style.top = top + 'px'
    },
    changeDirection(popoverRect, referenceRect) {
      const allHeight = referenceRect.bottom + popoverRect.height + 5
      switch (this.placement) {
        case 'top':
          if (referenceRect.top - popoverRect.height - 5 < 10) {
            this.momentPlacement = 'bottom'
          } else {
            this.momentPlacement = 'top'
          }
          break
        case 'bottom':
          if (window.innerHeight - allHeight < 10) {
            this.momentPlacement = 'top'
          } else {
            this.momentPlacement = 'bottom'
          }
          break
        default:
          break
      }
    }
  },
  render() {
    const { pClass, popoverStyle, mouseenterWrap, mouseleaveWrap, $slots, message } = this
    return (
      h(Transition,
        { name: 'fade', mode: 'out-in', appear: true },
        {
          default() {
            return h('div',
              {
                ref: 'popover',
                class: 'eff-table__popover ' + pClass,
                style: popoverStyle,
                onMouseenter: mouseenterWrap,
                onMouseleave: mouseleaveWrap
              },
              [
                $slots.default && $slots.default() || (message || []).map((d, i) => h('div', { key: i, class: `eff-table__popover-item is--${d.type}` }, d.message)),
                h('div', { ref: 'arrow', class: 'eff-table__popover-arrow' })
              ]
            )
          }
        }
      )
    )
  }
}
</script>

<style lang="scss">
.eff-table__popover {
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

  &-item{
    + .eff-table__popover-item{
      margin-top: 10px;
    }
  }

  .is--error{
    color: red;
  }
  &--visible {
    visibility: visible;
    opacity: 1;
  }
  &--hidden {
    visibility: hidden;
    opacity: 0;
  }
  &-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    &:after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border: 5px solid transparent;
    }
  }
}

.eff-table__popover-top .eff-table__popover-arrow {
  border-top-color: var(--borderColor);
  margin-left: -6px;
  left: 50%;
  top: 100%;
}

.eff-table__popover-top .eff-table__popover-arrow:after {
  top: -6px;
  margin-left: -5px;
  border-top: 5px solid var(--bgColor);
}

.eff-table__popover-right .eff-table__popover-arrow {
  border-right-color: var(--borderColor);
  margin-top: -6px;
  left: -12px;
  top: 50%;
}

.eff-table__popover-right .eff-table__popover-arrow:after {
  left: -3px;
  margin-top: -5px;
  border-right: 5px solid var(--bgColor);
}

.eff-table__popover-bottom .eff-table__popover-arrow {
  border-bottom-color: var(--borderColor);
  margin-left: -6px;
  top: -12px;
  left: 50%;
}

.eff-table__popover-bottom .eff-table__popover-arrow:after {
  top: -3px;
  margin-left: -5px;
  border-bottom: 5px solid var(--bgColor);
}

.eff-table__popover-left .eff-table__popover-arrow {
  border-left-color: var(--borderColor);
  margin-top: -6px;
  left: 100%;
  top: 50%;
}

.eff-table__popover-left .eff-table__popover-arrow:after {
  right: -3px;
  margin-top: -5px;
  border-left: 5px solid var(--bgColor);
}
</style>
