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
      setTimeout(() => {
        console.log(this.$children)
      }, 100)
      this.$nextTick(() => {
        const { componentInstance } = this.$slots.default[0]
        if (componentInstance) {
          componentInstance.editIsStop = true
          setTimeout(() => {
            componentInstance.focus()
            componentInstance.editIsStop = false
          }, 100)
        }
      })
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
    return <div class='eff-table__popup'></div>
  }
}
