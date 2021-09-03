import TableBodyColumn from './TableBodyColumn'
import { getCell } from 'pk/utils/dom'

export default {
  name: 'TableBodyRow',
  components: { TableBodyColumn },
  props: {
    bodyColumns: { type: Array, default: () => [] },
    row: { type: Object, default: () => {} },
    rowid: { type: String, default: '' },
    messages: { type: Array, default: () => [] },
    fixed: { type: String, default: '' },
    rowIndex: Number,
    summary: Boolean,
    groupFloor: { type: Number, default: 0 },
    vue: { type: Object, default: null }
  },
  functional: true,
  inject: ['table'],
  render(h, context) {
    const { props, injections } = context
    const { table } = injections
    const { bodyColumns, row, rowid, rowIndex, messages, fixed, summary, groupFloor, vue } = props
    const { rowId, showSpace, columnRenderIndex, currentRow, rowClassName, editStore, edit: tableEdit, copy, tableEditConfig } = table
    const isPending = Boolean(editStore.pendingList.find(d => d[rowId] === row[rowId]))
    const handleMouseenter = function() {
      table.hoverRowid = rowid
    }
    const handleMouseleave = function() {
      table.hoverRowid = null
    }
    const handleEvent = function(event, name) {
      const cell = getCell(event)
      let column = null
      if (cell) {
        const colid = cell.getAttribute('data-colid')
        if (colid) {
          const [, columnIndex] = colid.split('-')
          column = table.bodyColumns[columnIndex - 1]
          if (column) {
            const obj = { row, rowid, column, prop: column.prop, rowIndex, columnIndex, cell, event }
            const { edit } = table.$refs
            if (tableEdit && edit) {
              const arrow = cell.querySelector('.eff-table--expand')
              if (!isPending && name === (copy ? 'dblclick' : tableEditConfig.trigger) && (!arrow || arrow && !arrow.contains(event.target))) {
                edit.handleEditCell(obj)
              }
            }
            table.$emit(`cell-${name}`, obj)
          }
        }
      }
      table.$emit(`row-${name}`, { row, column, rowIndex, event })
    }
    const handleClick = function(event) {
      if (summary) return
      table.highlightCurrentRow && (table.currentRow = rowIndex)
      handleEvent(event, 'click')
    }
    const handleDoubleClick = function(event) {
      if (summary) return
      handleEvent(event, 'dblclick')
    }

    let groupKey
    bodyColumns.map(v => {
      if (['expand', 'selection', 'radio'].indexOf(v.type) === -1) {
        groupKey = !groupKey ? v.prop : groupKey
      }
    })

    const rowClassNames = ['eff-table__body-row', {
      'current-row': currentRow === rowIndex,
      'is--hover': table.hoverRowid === rowid,
      'is--new': editStore.insertList.find(d => d[rowId] === row[rowId]),
      'is--pending': isPending
    },
    rowClassName ? (typeof rowClassName === 'function' ? rowClassName({ row, rowIndex }) : rowClassName) : ''
    ]

    const rowStyle = {}
    const { overflowX, bodyRenderWidth, rowHeight } = table
    rowStyle.height = rowHeight + 'px'
    if (overflowX && !fixed) {
      rowStyle.width = bodyRenderWidth + 'px'
    }

    return (
      <div
        class={rowClassNames}
        style={rowStyle}
        data-rowid={rowid}
        key={rowid}
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
              id={summary ? '' : table.tableId + '_' + colid}
              data-colid={colid}
              data-rowid={rowid}
              row={row}
              rowid={rowid}
              rowIndex={rowIndex}
              column={column}
              columnIndex={columnIndex}
              message={message}
              fixed={fixed}
              vue={vue}
              disabled={isPending}
              summary={summary}
              groupFloor={groupKey === column.prop ? groupFloor : 0 }
              groupKey={groupKey}
            />
          })
        }
        {
          showSpace ? <div class='eff-table__column is--space' /> : ''
        }
      </div>
    )
  }
}
