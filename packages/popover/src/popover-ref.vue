<script>
import { on, off } from 'pk/utils/dom'
export default {
  name: 'PopoverRef',
  props: {
    reference: HTMLElement,
    effect: { type: String, default: '' },
    msgType: { type: String, default: 'popover' },
    message: { type: [String, Array], default: '' }
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
      const { msgType, reference = this.$el, message, effect } = this
      if (msgType === 'popover') {
        message && this.root.tipShow({ reference, effect, message: [{ type: 'dark', message }] })
      }
    },
    handlerMouseleave(e) {
      if (this.msgType === 'popover') {
        this.root.tipClose()
      }
    }
  },
  render(h) {
    return this.$slots.default
  }
}
</script>
