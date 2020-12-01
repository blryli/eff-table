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
      const { overflowX, columnIsVirtual, bodyRenderWidth, bodyWidth, rowHeight } = this.table
      style.height = rowHeight + 'px'
      if (overflowX && !this.fixed) {
        style.width = (columnIsVirtual ? bodyRenderWidth : bodyWidth) + 'px'
      }
      return style
    },
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
          column = this.table.bodyColumns[columnIndex - 1]
          if (column) {
            table.$emit(`cell-${name}`, { row, column, rowIndex, columnIndex, cell, event })
          }
        }
      }
      table.$emit(`row-${name}`, { row, column, rowIndex, event })
    }
  }
}
