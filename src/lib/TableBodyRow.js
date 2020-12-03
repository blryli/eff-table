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
    const { showSpace, columnRenderIndex } = this.table
    const { rowIndex, rowClassName, fixed, row, messages, rowStyle, bodyColumns, handleClick, handleDoubleClick, handleMouseenter, handleMouseleave } = this
    return (
      <div
        class={rowClassName}
        style={rowStyle}
        data-rowid={rowIndex + 1}
        key={rowIndex + 1}
        on-click={handleClick}
        on-dblclick={handleDoubleClick}
        on-mouseenter={handleMouseenter}
        on-mouseleave={handleMouseleave}
      >
        {
          bodyColumns.map((column, columnIndex) => {
            columnIndex = fixed ? columnIndex : columnRenderIndex + columnIndex
            const colid = `${rowIndex + 1}-${columnIndex + 1}`
            const message = messages.find(d => d.prop === column.prop) || {}
            return <TableBodyColumn
              data-colid={colid}
              row={row}
              rowIndex={rowIndex}
              column={column}
              columnIndex={columnIndex}
              message={message}
              fixed={fixed}
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
    rowStyle() {
      const style = {}
      const { table, fixed } = this
      const { overflowX, columnIsVirtual, bodyRenderWidth, bodyWidth, rowHeight } = table
      style.height = rowHeight + 'px'
      if (overflowX && !fixed) {
        style.width = (columnIsVirtual ? bodyRenderWidth : bodyWidth) + 'px'
      }
      return style
    },
    rowClassName() {
      const { row, rowIndex, table } = this
      const { currentRow, rowClassName } = table
      let classes = `eff-table__body-row${currentRow === rowIndex ? ' current-row' : ''}`
      table.rowHoverIndex === rowIndex && (classes += ' is--hover')
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
      const { table, rowIndex, handleEvent } = this
      this.table.highlightCurrentRow && (table.currentRow = rowIndex)
      handleEvent(event, 'click')
    },
    handleDoubleClick(event) {
      if (this.summary) return
      this.handleEvent(event, 'dblclick')
    },
    handleEvent(event, name) {
      const { table } = this
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
