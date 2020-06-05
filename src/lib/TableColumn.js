export default {
  name: 'VTableColumn',
  props: {
    type: { type: String, default: '' },
    width: { type: Number, default: 0 },
    renderHeader: { type: Function, default: () => {} },
    minWidth: { type: Number, default: 0 },
    label: { type: String, default: '' },
    prop: { type: String, default: '' },
    fixed: { type: String, validator: val => ['left', 'right'].indexOf(val) > -1 },
    className: { type: String, default: '' },
    labelClassName: { type: String, default: '' },
    showOverflowTooltip: Boolean,
    show: Boolean
  },
  data() {
    return {
      columnConfig: null
    }
  },
  inject: ['table'],
  mounted() {
    const { header } = this.$slots
    const { renderSlot } = this
    this.columnConfig = Object.keys(this.$options.props).reduce((acc, cur) => {
      this.$watch(cur, (newVal) => {
        console.log({ cur, newVal })
        this.columnConfig[cur] = newVal
      })
      acc[cur] = this[cur]
      return acc
    }, { header, renderSlot })
    this.table.$emit('insert.column', this.columnConfig)
  },
  destroyed() {
    this.table.$emit('remove.column', this.columnConfig)
  },
  methods: {
    renderSlot(h, data) {
      return this.$scopedSlots.default ? this.$scopedSlots.default(data)
        : this.$slots.default ? this.$slots.default[0] : false
    }
  },
  render(h) {
    return h('div', {}, [])
  }
}
