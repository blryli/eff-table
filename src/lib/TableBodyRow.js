import TableBodyColumn from './TableBodyColumn'
import { getCell } from 'utils/dom'

export default {
  name: 'TableBodyRow',
  components: { TableBodyColumn },
  props: {
    row: { type: Object, default: () => {} },
    messages: { type: Array, default: () => [] },
    rowIndex: Number,
    summary: Boolean
  },
  inject: ['table'],
  render(h) {
    const { rowStyle, bodyColumns, showSpace } = this.table
    return (
      <div
        class={this.rowClassName}
        style={rowStyle}
        data-rowid={this.rowIndex + 1}
        on-click={event => this.handleClick(event)}
        on-dblclick= {event => this.handleDoubleClick(event)}
      >
        {
          bodyColumns.map((column, columnIndex) => {
            const colid = `${this.rowIndex + 1}-${columnIndex + 1}`
            const message = this.messages.find(d => d.prop === column.prop) || {}
            return <TableBodyColumn
              data-colid={colid}
              row={this.row}
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
      if (rowClassName) {
        classes += ' ' + (typeof rowClassName === 'function' ? rowClassName({ row, rowIndex }) : rowClassName)
      }
      return classes
    }
  },
  methods: {
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
          column = table.bodyColumns[columnIndex - 1]
          if (column) {
            table.$emit(`cell-${name}`, { row, column, rowIndex, columnIndex, cell, event })
          }
        }
      }
      table.$emit(`row-${name}`, { row, column, rowIndex, event })
    }
  }
}
