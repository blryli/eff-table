import { removeBody, getDomClientRect } from 'pk/utils/dom'
import XEUtils from 'xe-utils'

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
    offset: { type: Number, default: 0 },
    vslot: { type: [Object, Array], default: () => {} },
    addToBody: Boolean,
    isFixed: Boolean,
    showAlways: Boolean,
    disabled: Boolean
  },
  data() {
    return {
      show: false,
      addedBody: false,
      momentPlacement: this.placement,
      arrowStyle: { left: null }
    }
  },
  computed: {
    isVisible() {
      const { showAlways, show, disabled, message, $slots, vslot } = this
      return (showAlways || show) && !disabled && (vslot || message || $slots.default)
    },
    pClass() {
      const { effect, momentPlacement, popoverClass, isFixed, isVisible } = this
      return `${effect ? `is-${effect}` : 'is-light'}  eff-table__popover-${momentPlacement} ${popoverClass} ${isVisible ? 'eff-table__popover--visible' : 'eff-table__popover--hidden'} ${isFixed ? 'is--fixed' : ''}`
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
    showAlways(val) {
      if (val) {
        this.timer = setTimeout(this.calculateCoordinate, 0)
      }
    },
    show(val) {
      if (val) {
        this.timer = setTimeout(() => {
          this.popoverAddedBody()
          this.calculateCoordinate()
        }, 0)
      } else {
        this.timer = null
      }
    },
    placement(val) {
      this.momentPlacement = val
    }
  },
  inject: {
    table: { default: null },
    form: { default: null },
    transferPanel: { default: null }
  },
  mounted() {
  },
  beforeDestroy() {
    this.addedBody && removeBody(this, 'popover')
    this.addedBody = false
    this.timer = null
    this.timeoutPending = null
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
      if (enterable) {
        clearTimeout(timeoutPending)
        return
      }
      this.show = true
    },
    mouseleaveWrap() {
      if (this.enterable) {
        this.timeoutPending = setTimeout(() => {
          this.show = false
        }, 200)
        return
      }
      this.show = false
    },
    calculateCoordinate() {
      const { addedBody, $el, reference, isFixed, table, form, transferPanel, offset, popoverAddedBody, changeDirection } = this
      !addedBody && popoverAddedBody()
      const popover = $el
      const referenceRect = getDomClientRect(reference)
      const popoverRect = getDomClientRect(popover)

      changeDirection(popoverRect, referenceRect, popover)

      let top
      let left = referenceRect.centerX - (popoverRect.width / 2)
      switch (this.momentPlacement) {
        case 'top':
          top = referenceRect.top - popoverRect.height - 10 + offset
          break
        case 'bottom':
          top = referenceRect.bottom + 10 - offset
          break

        default:
          console.error('Wrong placement must top/bottom')
          break
      }
      const { left: tLeft, top: tTop } = getDomClientRect((transferPanel || form || table).$el)
      !isFixed && (left = left - tLeft)
      popover.style.left = left + 'px'
      popover.style.top = top - (isFixed ? 0 : tTop) + 'px'
      this.arrowStyle.left = popoverRect.width / 2 - 2 + 'px'
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
    const { pClass, popoverStyle, mouseenterWrap, mouseleaveWrap, $slots, message, vslot, arrowStyle } = this
    return <transition name='effFade'>
      <div
        ref='popover'
        class={'eff-table__popover ' + pClass}
        style={popoverStyle}
        on-mouseenter={mouseenterWrap}
        on-mouseleave={mouseleaveWrap}
      >
        {
          vslot || $slots.default || (Array.isArray(message) ? message : [{ message }]).map((d, i) => <div key={i} class={`eff-table__popover-item is--${d.type}`}>{
            XEUtils.isArray(d.message) ? d.message.map(m => <div>{m}</div>) : d.message
          }</div>)
        }
        <div ref='arrow' style={arrowStyle} class='eff-table__popover-arrow' />
      </div>
    </transition>
  }
}

