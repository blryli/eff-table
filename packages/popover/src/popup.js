export default {
  name: 'popup',
  props: {
    content: { type: String, default: '' }
  },
  inject: ['table'],
  mounted() {
    const { table } = this
    if (table.edit) {
      // console.log(table.$refs.popovers)
      // this.editPopover = table.$refs.popovers.$refs.editPopover
      // console.log(this.editPopover)
    }
  },
  methods: {
    focus() {
      this.table.$refs.popovers.editTipShow({ reference: this.$el, vslot: this.$slots.default, placement: 'bottom' })
      this.$emit('open')
    },
    close() {
      this.table.$refs.popovers.editTipClose()
    },
    blur() {
      this.close()
      this.$emit('close')
    }
  },
  render(h) {
    return <div class='eff-table__popup'>{this.content}</div>
  }
}
