import VCheckbox from '../components/Checkbox'

export default {
  name: 'VTableHeaderColumn',
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
      let classes = `v-table__column`
      if (this.column.fixed) {
        classes += ' is-drag--filter'
        if (this.table.bodyOverflowX) classes += ' is--fixed'
      }
      this.column.labelClassName && (classes += ` ${this.column.labelClassName}`)
      return classes
    }
  },
  render(h) {
    const { column, columnIndex: $index } = this
    const slot = column.headerRender && column.headerRender(h, { column, $index }) || column.header || (column.type === 'selection' ? this.renderSelection(h) : column.type === 'index' ? (column.label || '#') : column.label)

    return (
      <div
        class={this.columnClass}
        data-colid={this.columnIndex}
        style={this.table.setColumnStyle(column, $index, this.width)}
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
