import { removeBody, getDomClientRect } from 'packages/table/utils/dom'

export default {
  name: 'Popover',
  props: {
    effect: { type: [String, Object], default: 'light' },
    // popover消息提示
    data: { type: [String, Object, Array], default: '' },
    placement: { type: String, default: 'top' },
    borderColor: { type: String, default: '#ddd' },
    popoverClass: { type: String, default: '' },
    trigger: { type: String, default: 'hover' },
    reference: HTMLElement,
    message: { type: [String, Array], default: '' },
    enterable: Boolean,
    hideDelay: { type: Number, default: 200 },
    vslot: {},
    addToBody: Boolean,
    isFixed: Boolean
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
      const { effect, show, momentPlacement, popoverClass, isFixed } = this
      return `${effect ? `is-${effect}` : 'is-light'}  eff-table__popover-${momentPlacement} ${popoverClass} ${show ? 'eff-table__popover--visible' : 'eff-table__popover--hidden'} ${isFixed ? 'is--fixed' : ''}`
    },
    popoverStyle() {
      const { effect } = this
      const style = {
        '--borderColor': '#ddd',
        '--bgColor': '#fff',
        '--color': '#303133'
      }
      if (!effect) {
        return style
      }
      if (typeof effect === 'string') {
        switch (effect) {
          case 'light':
            style['--borderColor'] = '#ddd'
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
            : '#ddd'
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
    },
    placement(val) {
      this.momentPlacement = val
    }
  },
  inject: ['table'],
  mounted() {
  },
  beforeDestroy() {
    this.addedBody && removeBody(this, 'popover')
  },
  deactivated() {
    this.addedBody && removeBody(this, 'popover')
    this.addedBody = false
  },
  methods: {
    popoverAddedBody() {
      const { addToBody, addedBody, show, $el } = this
      if (!addedBody && show) {
        if (addToBody) document.body.appendChild($el)
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
      const { addedBody, $el, reference, isFixed, popoverAddedBody, changeDirection } = this
      !addedBody && popoverAddedBody()
      const popover = $el
      const referenceRect = getDomClientRect(reference)
      const popoverRect = getDomClientRect(popover)

      changeDirection(popoverRect, referenceRect, popover)

      let top
      const left = referenceRect.centerX - (popoverRect.width / 2)
      switch (this.momentPlacement) {
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
      const { left: tLeft, top: tTop } = getDomClientRect(this.table.$el)
      popover.style.left = left - (isFixed ? 0 : tLeft) + 'px'
      popover.style.top = top - (isFixed ? 0 : tTop) + 'px'
    },
    changeDirection(popoverRect, referenceRect, popover) {
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
  render(h) {
    const { pClass, popoverStyle, mouseenterWrap, mouseleaveWrap, $slots, message } = this
    return <transition name='effFade'>
      <div
        ref='popover'
        class={'eff-table__popover ' + pClass}
        style={popoverStyle}
        on-mouseenter={mouseenterWrap}
        on-mouseleave={mouseleaveWrap}
      >
        {
          this.vslot || $slots.default || (message || []).map((d, i) => <div key={i} class={`eff-table__popover-item is--${d.type}`}>{d.message}</div>)
        }
        <div ref='arrow' class='eff-table__popover-arrow' />
      </div>
    </transition>
  }
}

