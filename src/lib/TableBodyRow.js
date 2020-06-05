import TableBodyColumn from './TableBodyColumn'
import { getCell } from 'utils/dom'

export default {
  name: 'TableBodyRow',
  components: { TableBodyColumn },
  props: {
    item: { type: Object, default: () => {} },
    index: Number
  },
  inject: ['table'],
  render(h) {
    return (
      <div
        class={`eff-table__body-row${this.table.currentRow === this.index ? ' current-row' : ''}`}
        style={this.table.rowStyle}
        data-rowid={this.index + 1}
        on-click={event => this.handleClick(event)}
        on-dblclick= {event => this.handleDoubleClick(event)}
      >
        {
          this.table.columns.filter(d => d.show !== false).map((column, columnIndex) => {
            const colid = `${this.index + 1}-${columnIndex + 1}`
            return <TableBodyColumn
              data-colid={colid}
              item={this.item}
              index={this.index}
              column={column}
              columnIndex={columnIndex}
            />
          })
        }
        {
          <div class='eff-table__column is--space' hidden={this.table.minWidth > this.table.bodyWidth} />
        }
      </div>
    )
  },
  methods: {
    handleClick(event) {
      this.table.highlightCurrentRow && (this.table.currentRow = this.index)
      this.handleEvent(event, 'click')
    },
    handleDoubleClick(event) {
      this.handleEvent(event, 'dblclick')
    },
    handleEvent(event, name) {
      const table = this.table
      const cell = getCell(event)
      let column
      if (cell) {
        const colid = cell.getAttribute('data-colid')
        if (colid) {
          const [, colIndex] = colid.split('-')
          column = table.columns[colIndex - 1]
          if (column) {
            table.$emit(`cell-${name}`, this.item, column, cell, event)
          }
        }
      }
      table.$emit(`row-${name}`, this.item, column, event)
    }
  }
}
