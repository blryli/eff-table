import VCheckbox from '../components/Checkbox'

export default {
  name: 'TableHeaderColumn',
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    colid: { type: String, default: '' }
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
    const { column, columnIndex } = this
    const slot = column.titleRender && column.titleRender(h, { column, columnIndex }) || column.type === 'selection' ? this.renderSelection(h) : column.type === 'index' ? (column.title || '#') : column.title

    return (
      <div
        class={this.columnClass}
        data-colid={this.colid}
        data-colidx={this.columnIndex}
        style={this.table.setColumnStyle(column, columnIndex, this.width)}
      >
        <div class='eff-cell'>{slot}</div>
      </div>
    )
  },
  methods: {
    renderSelection(h) {
      return h('v-checkbox', {
        attrs: {
          value: this.table.selectionAll,
          key: this.columnIndex,
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
