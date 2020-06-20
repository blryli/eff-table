import VCheckbox from '../components/Checkbox'

export default {
  name: 'TableSearchColumn',
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 }
  },
  components: { VCheckbox },
  inject: ['table'],
  computed: {
    width() {
      let { width = 0 } = this.column
      !width && (width = this.table.spaceWidth)
      const columnWidth = Math.max(width, 40)
      return columnWidth
    },
    columnClass() {
      const { fixed, titleClassName } = this.column
      let classes = `eff-table__column`
      if (fixed) {
        if (this.table.bodyOverflowX || fixed === 'right') classes += ' is--fixed'
      }
      titleClassName && (classes += ` ${titleClassName}`)
      return classes
    }
  },
  render(h) {
    const { column, columnIndex } = this
    const { render } = column.search || {}
    if (render && typeof render !== 'function') {
      console.error('search render必须是函数！')
    }
    const slot = render && render(h, { column, columnIndex }) || ''
    console.log(slot)

    return (
      <div
        class={this.columnClass}
        data-colid={this.columnIndex}
        style={this.table.setColumnStyle(column, columnIndex, this.width)}
      >
        <div class='v-cell'>{slot}</div>
      </div>
    )
  },
  methods: {

  }
}
