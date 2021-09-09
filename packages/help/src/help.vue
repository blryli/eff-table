<script>
import { on, off } from 'pk/utils/dom'
export default {
  name: 'Help',
  props: {
    reference: HTMLElement,
    effect: { type: String, default: '' },
    msgType: { type: String, default: 'popover' },
    message: { type: [String, Array, Function], default: '' },
    placement: { type: String, default: 'top' },
    vslot: { type: Object, default: () => {} },
    enterable: Boolean
  },
  inject: {
    root: { default: null }
  },
  mounted() {
    if (!this.root) return
    this.$nextTick(() => {
      const { $el, handlerMouseenter, handlerMouseleave } = this
      on($el, 'mouseenter', handlerMouseenter)
      on($el, 'mouseleave', handlerMouseleave)
    })
  },
  beforeDestroy() {
    if (!this.root) return
    const { $el, handlerMouseenter, handlerMouseleave } = this
    off($el, 'mouseenter', handlerMouseenter)
    off($el, 'mouseleave', handlerMouseleave)
  },
  methods: {
    handlerMouseenter(e) {
      const { msgType, reference = this.$el, message, effect, vslot, placement, enterable } = this
      let msg = message
      if (typeof message === 'function') {
        msg = message()
      }
      if (msgType === 'popover') {
        const tipShow = this.root.tipShow || this.root.$refs.popovers.tipShow
        msg && tipShow && tipShow({ reference, effect, vslot, placement, isFixed: true, enterable, message: [{ type: 'dark', message: msg }] })
      }
    },
    handlerMouseleave(e) {
      if (this.msgType === 'popover') {
        const tipClose = this.root.tipClose || this.root.$refs.popovers.tipClose
        tipClose()
      }
    }
  },
  render(h) {
    return this.$slots.default
  }
}
</script>
