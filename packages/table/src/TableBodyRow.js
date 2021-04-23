import TableBodyColumn from './TableBodyColumn'
import { getCell } from 'pk/utils/dom'

export default {
  name: 'TableBodyRow',
  components: { TableBodyColumn },
  props: {
    bodyColumns: { type: Array, default: () => [] },
    row: { type: Object, default: () => {} },
    messages: { type: Array, default: () => [] },
    fixed: { type: String, default: '' },
    rowIndex: Number,
    summary: Boolean,
    groupFloor: { type: Number, default: 0 }

  },
  inject: ['table'],
  render(h) {
    const { showSpace, columnRenderIndex, rowId } = this.table
    const { rowIndex, rowClassName, fixed, row, messages, rowStyle, isPending, bodyColumns, handleClick, handleDoubleClick, handleMouseenter, handleMouseleave } = this
    const id = row[rowId]

    let groupKey
    bodyColumns.map(v => {
      if (['expand', 'selection', 'radio'].indexOf(v.type) === -1) {
        groupKey = !groupKey ? v.prop : groupKey
      }
    })

    return (
      <div
        class={rowClassName}
        style={rowStyle}
        rowid={id}
        data-rowid={rowIndex + 1}
        key={id}
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
              disabled={isPending}
              groupFloor={groupKey === column.prop ? this.groupFloor : 0 }
              groupKey={groupKey}
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
      const { currentRow, rowClassName, editStore, rowId } = table
      return ['eff-table__body-row', {
        'current-row': currentRow === rowIndex,
        'is--hover': table.rowHoverIndex === rowIndex,
        'is--new': editStore.insertList.find(d => d[rowId] === row[rowId]),
        'is--pending': this.isPending
      },
      rowClassName ? (typeof rowClassName === 'function' ? rowClassName({ row, rowIndex }) : rowClassName) : ''
      ]
    },
    isPending() {
      const { table, row } = this
      const { editStore, rowId } = table
      return Boolean(editStore.pendingList.find(d => d[rowId] === row[rowId]))
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
      const { table, row, rowIndex, isPending } = this
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
            !isPending && name === 'click' && edit && edit.handleEditCell(obj)
            table.$emit(`cell-${name}`, obj)
          }
        }
      }
      table.$emit(`row-${name}`, { row, column, rowIndex, event })
    }
  }
}
