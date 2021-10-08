import TableBodyColumn from './TableBodyColumn'
import { getCell } from 'pk/utils/dom'
import XEUtils from 'xe-utils'

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
    subtotal: Boolean,
    treeFloor: { type: Number, default: 0 },
    treeIndex: { type: Number, default: 0 },
    vue: { type: Object, default: null }
  },
  functional: true,
  inject: ['table'],
  render(h, context) {
    const { props, injections } = context
    const { table } = injections
    const { bodyColumns, row, rowid, rowIndex, messages, fixed, summary, subtotal, treeFloor, treeIndex, vue } = props
    const { rowId, showSpace, columnRenderIndex, currentRow, rowClassName, editStore, edit: tableEdit, copy, tableEditConfig, spanMethod, isSpanMethod } = table
    const isPending = Boolean(editStore.pendingList.find(d => d[rowId] === row[rowId]))
    const handleMouseenter = function() {
      if (isSpanMethod) return
      table.hoverRowid = rowid
    }
    const handleMouseleave = function() {
      if (isSpanMethod) return
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
              const arrow = cell.querySelector('.eff-table--expand-handle')
              const ciphertext = cell.querySelector('.eff-table--ciphertext')
              if (!isPending && name === (copy ? 'dblclick' : tableEditConfig.trigger) && (!arrow || arrow && !arrow.contains(event.target)) && !ciphertext) {
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
      if (summary || subtotal) return
      table.highlightCurrentRow && (table.currentRow = rowIndex)
      handleEvent(event, 'click')
    }
    const handleDoubleClick = function(event) {
      if (summary || subtotal) return
      handleEvent(event, 'dblclick')
    }

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
          bodyColumns.reduce((acc, column, columnIndex) => {
            columnIndex = fixed ? columnIndex : columnRenderIndex + columnIndex
            const colid = `${rowIndex + 1}-${columnIndex + 1}`
            const message = messages.find(d => d.prop === column.prop) || {}
            const span_method = XEUtils.isFunction(spanMethod) ? spanMethod({ row, rowIndex, column, columnIndex }) : null
            let rowspan = 1
            let colspan = 1
            if (span_method) {
              const { rowspan: row_span, colspan: col_span } = span_method
              if (!row_span && !col_span) return acc
              rowspan = row_span
              colspan = col_span
            }

            return acc.concat(<TableBodyColumn
              id={summary ? '' : table.tableId + '_' + colid}
              data-colid={colid}
              data-rowid={rowid}
              row={row}
              rowid={rowid}
              rowIndex={rowIndex}
              column={column}
              columnIndex={columnIndex}
              rowspan={rowspan}
              colspan={colspan}
              message={message}
              fixed={fixed}
              vue={vue}
              disabled={isPending}
              summary={summary}
              subtotal={subtotal}
              treeFloor={treeFloor}
              treeIndex={treeIndex}
            />)
          }, [])
        }
        {
          showSpace ? <div class='eff-table__column is--space' /> : ''
        }
      </div>
    )
  }
}
