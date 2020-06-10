import VCheckbox from '../components/Checkbox'

export default {
  name: 'EffTableHeaderColumn',
  props: {
    column: { type: Object, default: () => {} },
    colIndex: { type: Number, default: 0 }
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
      const { fixed, drag, titleClassName } = this.column
      let classes = `eff-table__column`
      if (fixed || drag === false) {
        classes += ' is-drag--filter'
        if (this.table.bodyOverflowX || fixed === 'right') classes += ' is--fixed'
      }
      titleClassName && (classes += ` ${titleClassName}`)
      return classes
    }
  },
  render(h) {
    const { column, colIndex } = this
    const slot = column.titleRender && column.titleRender(h, { column, colIndex }) || column.header || (column.type === 'selection' ? this.renderSelection(h) : column.type === 'index' ? (column.title || '#') : column.title)

    return (
      <div
        class={this.columnClass}
        data-colid={this.colIndex}
        style={this.table.setColumnStyle(column, colIndex, this.width)}
      >
        <div class='v-cell'>{slot}</div>
      </div>
    )
  },
  methods: {
    renderSelection(h) {
      return h('v-checkbox', {
        attrs: {
          value: this.table.selectionAll,
          key: this.index,
          indeterminate: this.table.indeterminate
        },
        on: { change: this.selectionChange }
      })
    },
    selectionChange(val) {
      this.table.$emit('all.selection.change', val)
    }
  }
}
