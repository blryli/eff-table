<template>
  <div
    @mouseenter="handlerNodeMouseenter"
    @mouseleave="handlerNodeMouseleave"
  ><slot /></div>
</template>

<script>
export default {
  name: 'PopoverRef',
  props: {
    reference: HTMLElement,
    msgType: { type: String, default: 'popover' },
    message: { type: [String, Array], default: '' }
  },
  inject: {
    table: { default: null }
  },
  methods: {
    handlerNodeMouseenter(e) {
      const { msgType, reference = this.$el, message } = this
      if (msgType === 'popover') {
        message && this.root.tipShow({ reference, message: [{ type: 'error', message }] })
      }
    },
    handlerNodeMouseleave(e) {
      if (this.msgType === 'popover') {
        this.root.tipClose()
      }
    }
  }
}
</script>
