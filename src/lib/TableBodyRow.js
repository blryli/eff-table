import TableBodyColumn from './TableBodyColumn'
import { getCell } from 'utils/dom'

export default {
  name: 'TableBodyRow',
  components: { TableBodyColumn },
  props: {
    bodyColumns: { type: Array, default: () => [] },
    row: { type: Object, default: () => {} },
    messages: { type: Array, default: () => [] },
    fixed: { type: String, default: '' },
    rowIndex: Number,
    summary: Boolean
  },
  inject: ['table'],
  render(h) {
    const { rowStyle, showSpace } = this.table
    return (
      <div
        class={this.rowClassName}
        style={rowStyle}
        data-rowid={this.rowIndex + 1}
        on-click={this.handleClick}
        on-dblclick={this.handleDoubleClick}
        on-mouseenter={this.handleMouseenter}
        on-mouseleave={this.handleMouseleave}
      >
        {
          this.bodyColumns.map((column, columnIndex) => {
            const colid = `${this.rowIndex + 1}-${columnIndex + 1}`
            const message = this.messages.find(d => d.prop === column.prop) || {}
            return <TableBodyColumn
              data-colid={colid}
              row={this.row}
              key={this.rowIndex + '-' + columnIndex}
              rowIndex={this.rowIndex}
              column={column}
              columnIndex={columnIndex}
              message={message}
            />
          })
        }
        {
          showSpace ? <div class='eff-table__column is--space' /> : ''
        }
      </div>
    )
  },
  computed: {
    rowClassName() {
      const { currentRow, rowClassName } = this.table
      const { row, rowIndex } = this
      let classes = `eff-table__body-row${currentRow === this.rowIndex ? ' current-row' : ''}`
      this.table.rowHoverIndex === rowIndex && (classes += ' is--hover')
      if (rowClassName) {
        classes += ' ' + (typeof rowClassName === 'function' ? rowClassName({ row, rowIndex }) : rowClassName)
      }
      return classes
    }
  },
  methods: {
    handleMouseenter() {
      this.table.rowHoverIndex = this.rowIndex
    },
    handleMouseleave() {
      this.table.rowHoverIndex = null
    },
    handleClick(event) {
      if (this.summary) return
      this.table.highlightCurrentRow && (this.table.currentRow = this.rowIndex)
      this.handleEvent(event, 'click')
    },
    handleDoubleClick(event) {
      if (this.summary) return
      this.handleEvent(event, 'dblclick')
    },
    handleEvent(event, name) {
      const table = this.table
      const cell = getCell(event)
      const { row, rowIndex } = this
      let column
      if (cell) {
        const colid = cell.getAttribute('data-colid')
        if (colid) {
          const [, columnIndex] = colid.split('-')
          column = this.bodyColumns[columnIndex - 1]
          if (column) {
            table.$emit(`cell-${name}`, { row, column, rowIndex, columnIndex, cell, event })
          }
        }
      }
      table.$emit(`row-${name}`, { row, column, rowIndex, event })
    }
  }
}
