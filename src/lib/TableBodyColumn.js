import VCheckbox from '../components/Checkbox'

export default {
  name: 'TableBodyColumn',
  props: {
    row: { type: Object, default: () => {} },
    rowIndex: { type: Number, default: 0 },
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 }
  },
  components: { VCheckbox },
  inject: ['table'],
  data() {
    return {
      checked: false
    }
  },
  render(h) {
    const slot = this.cellRender(h) || (this.column.type === 'selection' ? this.renderSelection(h) : this.column.type === 'index' ? this.rowIndex + 1 : this.column.prop ? this.row[this.column.prop] : '')
    return (
      <div
        class={this.columnClass}
        style={this.table.setColumnStyle(this.column, this.columnIndex, this.width)}
        on-mouseenter={event => this.handleMouseenter(event, slot)}
        on-mouseleave={event => this.handleMouseleave(event, slot)}
      >
        <div ref='cell' class='eff-cell'>{slot}</div>
      </div>
    )
  },
  computed: {
    width() {
      let { width = 0 } = this.column
      !width && (width = this.table.spaceWidth)
      const columnWidth = Math.max(width, 40)
      return columnWidth
    },
    columnClass() {
      let classes = `eff-table__column`
      const { fixed, className } = this.column
      if (fixed) {
        classes += ' is-drag--filter'
        if (this.table.bodyOverflowX || fixed === 'right') classes += ' is--fixed'
      }
      className && (classes += ` ${className}`)
      return classes
    }
  },
  methods: {
    renderSelection(h) {
      return h('v-checkbox', {
        attrs: { value: this.table.isChecked(this.rowIndex), key: this.rowIndex },
        on: { change: this.selectionRowChange }
      })
    },
    handleMouseenter(event, slot) {
      const { row, column, rowIndex, columnIndex } = this
      const { cell } = this.$refs
      this.table.$emit('cell-mouse-enter', { row, column, rowIndex, columnIndex, cell, event, slot })
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }
      // 如果文本溢出 显示tooltip
      const range = document.createRange()
      range.setStart(cell, 0)
      range.setEnd(cell, cell.childNodes.length)
      const rangeWidth = range.getBoundingClientRect().width
      const padding = parseInt(this.getStyle(cell, 'paddingLeft')) + parseInt(this.getStyle(cell, 'paddingRight'))
      if (padding + rangeWidth > this.width) {
        this.table.show = true
        this.table.reference = cell
        this.table.popoverSlot = slot
      }
    },
    getStyle(elem, prop) {
      if (prop) prop = prop.replace(/([A-Z])/g, str => '-' + str.toLowerCase())
      return window.getComputedStyle(elem, null).getPropertyValue(prop)
    },
    handleMouseleave(event, slot) {
      const { row, column, rowIndex, columnIndex } = this
      const { cell } = this.$refs
      this.table.$emit('cell-mouse-leave', { row, column, rowIndex, columnIndex, cell, event, slot })
      this.table.show = false
    },
    cellRender(h) {
      return this.column.cellRender && this.column.cellRender(h, { row: this.row, rowIndex: this.rowIndex })
    },
    selectionRowChange(selected) {
      this.table.$emit('row.selection.change', this.rowIndex, selected)
    }
  }
}
