<script>
import { removeBody, getDomClientRect } from 'utils/dom'

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
    reference: null,
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
      return `${this.effect ? `is-${this.effect}` : 'is-light'}  v-popover__${this.momentPlacement} ${this.popoverClass} ${this.show ? 'v-popover--visible' : 'v-popover--hidden'}`
    },
    popoverStyle() {
      const style = {
        '--borderColor': '#ccc',
        '--bgColor': '#fff',
        '--color': '#303133'
      }
      if (!this.effect) {
        return style
      }
      if (typeof this.effect === 'string') {
        switch (this.effect) {
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
            style['--borderColor'] = this.effect
            style['--bgColor'] = this.effect
            style['--color'] = '#fff'
            break
        }
      } else if (typeof this.effect === 'object') {
        if (Array.isArray(this.effect)) {
          console.error('effect 只能是对象或字符串')
        } else {
          style['--borderColor'] = this.effect.borderColor
            ? this.effect.borderColor
            : '#ccc'
          style['--bgColor'] = this.effect.backgroundColor
            ? this.effect.backgroundColor
            : '#fff'
          style['--color'] = this.effect.olor ? this.effect.olor : '#303133'
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
  beforeDestroy() {
    this.addedBody && removeBody(this, 'popover')
  },
  deactivated() {
    this.addedBody && removeBody(this, 'popover')
    this.addedBody = false
  },
  methods: {
    popoverAddedBody() {
      if (!this.addedBody && this.show) {
        document.body.appendChild(this.$el)
        this.addedBody = true
      }
    },
    doShow() {
      if (this.timeoutPending) {
        clearTimeout(this.timeoutPending)
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
      this.enterable && clearTimeout(this.timeoutPending)
    },
    mouseleaveWrap() {
      if (this.enterable) {
        this.timeoutPending = setTimeout(() => {
          this.show = false
        }, 200)
      }
    },
    calculateCoordinate() {
      !this.addedBody && this.popoverAddedBody()
      const popover = this.$el
      const referenceRect = getDomClientRect(this.reference)
      const popoverRect = getDomClientRect(popover)

      this.changeDirection(popoverRect, referenceRect)

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
  render(h) {
    return <transition name='fade'>
      <div
        ref='popover'
        class={'v-popover ' + this.pClass}
        style={this.popoverStyle}
        on-mouseenter={this.mouseenterWrap}
        on-mouseleave={this.mouseleaveWrap}
      >
        {
          this.$slots.default || (this.message || []).map((d, i) => <div key={i} class={`v-popover-item is--${d.type}`}>{d.message}</div>)
        }
        <div ref='arrow' class='v-popover__arrow' />
      </div>
    </transition>
  }
}
</script>

<style lang="scss" scoped>
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

  &-item{
    + .v-popover-item{
      margin-top: 10px;
    }
  }

  .is--error{
    color: red;
  }
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
