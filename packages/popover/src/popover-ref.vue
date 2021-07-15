<script>
import { on, off } from 'pk/utils/dom'
export default {
  name: 'PopoverRef',
  props: {
    reference: HTMLElement,
    effect: { type: String, default: '' },
    msgType: { type: String, default: 'popover' },
    message: { type: [String, Array], default: '' },
    placement: { type: String, default: 'top' },
    vslot: { type: Object, default: () => {} },
    enterable: Boolean
  },
  inject: {
    root: { default: null }
  },
  mounted() {
    this.$nextTick(() => {
      const { $el, handlerMouseenter, handlerMouseleave } = this
      on($el, 'mouseenter', handlerMouseenter)
      on($el, 'mouseleave', handlerMouseleave)
    })
  },
  beforeDestroy() {
    const { $el, handlerMouseenter, handlerMouseleave } = this
    off($el, 'mouseenter', handlerMouseenter)
    off($el, 'mouseleave', handlerMouseleave)
  },
  methods: {
    handlerMouseenter(e) {
      const { msgType, reference = this.$el, message, effect, vslot, placement, enterable } = this
      if (msgType === 'popover') {
        const tipShow = this.root.tipShow || this.root.$refs.popovers.tipShow
        message && tipShow({ reference, effect, vslot, placement, enterable, message: [{ type: 'dark', message }] })
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
