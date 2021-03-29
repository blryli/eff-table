import TableBodyColumn from './TableBodyColumn'
import { getCell } from '../utils/dom'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'TableBodyRow',
  components: { TableBodyColumn },
  inject: ['table'],
  props: {
    bodyColumns: { type: Array, default: () => [] },
    row: { type: Object, default: () => {} },
    messages: { type: Array, default: () => [] },
    fixed: { type: String, default: '' },
    rowIndex: { type: Number, default: 0 },
    summary: Boolean
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
      table.highlightCurrentRow && (table.currentRow = rowIndex)
      handleEvent(event, 'click')
    },
    handleDoubleClick(event) {
      if (this.summary) return
      this.handleEvent(event, 'dblclick')
    },
    handleEvent(event, name) {
      const { table, row, rowIndex } = this
      const cell = getCell(event)
      let column
      if (cell) {
        const colid = cell.getAttribute('data-colid')
        if (colid) {
          const [, columnIndex] = colid.split('-')
          column = table.bodyColumns[columnIndex - 1]
          if (column) {
            const obj = { row, column, rowIndex, columnIndex, cell, event }
            const { edit } = table.$refs
            name === 'click' && edit && edit.handleEditCell(obj)
            table.$emit(`cell-${name}`, obj)
          }
        }
      }
      table.$emit(`row-${name}`, { row, column, rowIndex, event })
    }
  },
  render() {
    const { showSpace, columnRenderIndex } = this.table
    const { rowIndex, rowClassName, fixed, row, messages, rowStyle, bodyColumns, handleClick, handleDoubleClick, handleMouseenter, handleMouseleave } = this
    return (
      h('div',
        {
          class: rowClassName,
          style: rowStyle,
          'data-rowid': rowIndex + 1,
          key: rowIndex + 1,
          onClick: handleClick,
          onDblclick: handleDoubleClick,
          onMouseenter: handleMouseenter,
          onMouseleave: handleMouseleave
        },
        [
          bodyColumns.map((column, columnIndex) => {
            columnIndex = fixed ? columnIndex : columnRenderIndex + columnIndex
            const colid = `${rowIndex + 1}-${columnIndex + 1}`
            const message = messages.find(d => d.prop === column.prop) || {}
            return h(TableBodyColumn,
              {
                'data-colid': colid,
                row: row,
                rowIndex: rowIndex,
                column: column,
                columnIndex: columnIndex,
                message: message,
                fixed: fixed
              }
            )
          }),
          showSpace ? h('div', { class: 'eff-table__column is--space' }) : ''
        ]
      )
    )
  }
})
