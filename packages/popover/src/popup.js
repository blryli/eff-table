export default {
  name: 'popup',
  props: {
    content: { type: String, default: '' }
  },
  inject: ['table'],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    focus() {
      this.visible = true
      this.table.editTipShow({ reference: this.$el, vslot: this.$slots.default, placement: 'bottom' })
    },
    close() {
      this.visible = false
      this.table.editTipClose()
    },
    blur() {
      this.close()
    }
  },
  render(h) {
    return <div class='eff-table__popup'>{this.content}</div>
  }
}
