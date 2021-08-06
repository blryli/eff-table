import VCheckbox from 'pk/checkbox'
import VRadio from 'pk/radio'
import { getTextWidth, eqCellValue } from 'pk/utils/dom'
import { renderer } from 'pk/utils/render'
import RowDrag from 'pk/icon/src/rowDrag'
import { getFieldValue, initField } from 'pk/utils'
import XEUtils from 'xe-utils'

export default {
  name: 'TableBodyColumn',
  props: {
    row: { type: Object, default: () => {} },
    rowIndex: { type: Number, default: 0 },
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    message: { type: Object, default: () => {} },
    fixed: { type: String, default: '' },
    disabled: Boolean,
    groupFloor: { type: Number, default: 0 },
    groupKey: { type: String, default: '' },
    vue: { type: Object, default: null },
    summary: Boolean
  },
  inject: ['table'],
  functional: true,
  render(h, context) {
    const { props, data, injections } = context
    const { table } = injections
    const { vue, row, rowIndex, column, columnIndex, disabled, groupFloor, groupKey, summary } = props
    const { type, prop, className } = column
    const { spaceWidth, rowId, cellClassName, editStore: { updateList }, copy } = table
    // 为特殊prop时，初始化值
    if (prop && !(prop in row) && !column.initField && getFieldValue(row, prop) === undefined) {
      initField(row, prop, vue)
      column.initField = true
    }
    // 设置style
    const columnWidth = Math.max(column.width || spaceWidth, 40)
    const style = {}
    style.minWidth = columnWidth + 'px'
    style.maxWidth = columnWidth + 'px'
    if (columnIndex === 0) {
      style.borderLeft = 0
    }

    // 复制功能
    if (copy) {
      const { startRow, endRow, startColumn, endColumn } = table.$refs.selectRange._getReac()
      const borderStyle = `2px solid rgb(17 210 232)`
      if (columnIndex === startColumn && rowIndex >= startRow && rowIndex <= endRow) {
        style.borderLeft = borderStyle
      }
      if (rowIndex === startRow && columnIndex >= startColumn && columnIndex <= endColumn) {
        style.borderTop = borderStyle
      }
      if (columnIndex === endColumn && rowIndex >= startRow && rowIndex <= endRow) {
        style.borderRight = borderStyle
      }
      if (rowIndex === endRow && columnIndex >= startColumn && columnIndex <= endColumn) {
        style.borderBottom = borderStyle
      }
    }

    // 处理class
    let columnClass = `eff-table__column `
    const sourceRow = updateList.find(d => {
      return d.$old[rowId] === row[rowId]
    })
    const { message } = props.message || {}

    // 状态
    if (prop && sourceRow && !eqCellValue(sourceRow.$old, row, prop)) {
      columnClass += ' is--dirty'
    }
    // 消息
    if (message) columnClass += ' is--message'
    // class
    if (className) {
      if (typeof className === 'function') {
        const c = className({ row, column, rowIndex, columnIndex })
        c && (columnClass += ` ${c}`)
      } else {
        columnClass += ` ${className}`
      }
    }
    if (cellClassName) {
      if (typeof cellClassName === 'function') {
        const c = cellClassName({ row, column, rowIndex, columnIndex })
        c && (columnClass += ` ${c}`)
      } else {
        columnClass += ` ${cellClassName}`
      }
    }

    // 小计
    if (row.rowIsSum) {
      style.backgroundColor = 'rgba(64, 184, 131, 0.18)'
    }
    style.paddingLeft = groupFloor * 28 + 'px'
    // row[columnIndex] summary合计列

    const groupClick = function(e) {
      const pos = table.columnGroupIds.indexOf(row[table.rowId])

      if (pos === -1) {
        table.columnGroupIds.push(row[table.rowId])
        if (!row.children || !row.children.length) {
          column.groupStatus = 3

          table.commitProxy('loadChildren', row, (arr) => {
            vue.$set(row, 'children', arr)
            column.groupStatus = 2
            table.groupColumnNum += arr.length
          })
        } else {
          table.groupColumnNum += row.children.length
        }
      } else {
        table.groupColumnNum -= row.children.length
        table.columnGroupIds.splice(pos, 1)
      }
    }
    const renderSelection = function() {
      return h(VCheckbox, {
        attrs: { value: table.isChecked(row) },
        key: row[table.rowId],
        on: { change: selected => table.rowSelectionChange(row, selected) }
      })
    }
    const renderRadio = function(h) {
      return h(VRadio, {
        attrs: { value: table.isChecked(row) },
        key: row[table.rowId],
        on: { change: selected => table.rowSelectionChange(row, selected) }
      })
    }
    const cellRender = function(h) {
      const { cellRender, prop, config = {}, type, edit: { render } = {}} = column
      if (typeof cellRender === 'function') {
        return cellRender(h, { row, rowIndex, column, columnIndex, prop })
      } else {
        // 处理动态渲染器
        const dynamicConfig = {}
        if (XEUtils.isFunction(render)) {
          const renderFunc = render(h, { row, sourceRow, rowIndex, column, columnIndex, prop })
          if (!['VNode', 'pe'].includes(renderFunc.constructor.name)) {
            Object.assign(dynamicConfig, renderFunc)
          }
        }
        const renderOpts = XEUtils.merge({}, config, dynamicConfig, cellRender)
        const { name, tag, format } = renderOpts
        const compConf = renderer.get(dynamicConfig.name || name) || tag && renderer.get('default')
        const sourceRow = table.tableSourceData[rowIndex]
        const params = { root: table, table, vue, data: row, row, sourceRow, rowIndex, column, columnIndex, prop: dynamicConfig.prop || prop, renderCell: true }
        // 处理format
        if (XEUtils.isFunction(format)) {
          return format(params)
        }
        return compConf ? compConf.renderDefault(h, renderOpts, params) : type === 'index' ? rowIndex + 1 : prop ? row[prop] : ''
      }
    }
    const rowExpanded = table.expands.find(d => d.rowId === row[rowId]) || {}
    const expandClick = function() {
      table.expandChange({ rowId: row[rowId], height: 0 })
    }
    const expandRender = function() {
      const expand = <span class={{ 'eff-icon-expand': true, 'is--expanded': rowExpanded.expanded, 'is--disabled': disabled }} on-click={e => !disabled && expandClick(e)} />

      return expand
    }
    const handleMouseenter = function(event, slot) {
      if (summary) return
      const cell = document.getElementById(row[rowId] + column.columnId)
      table.$emit('cell-mouse-enter', { row, column, rowIndex, columnIndex, cell, event, slot })
      if (!cell) return
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }

      let placement = 'top'

      if (column.width && getTextWidth(cell) > Math.max(column.width, 40) || !column.width && getTextWidth(cell) > table.spaceWidth) {
        table.$refs.popovers.tipShow({ reference: cell.parentNode, placement, effect: 'dark', message: cell.innerText, isFixed: true })
        placement = 'bottom'
      }
      message && table.$refs.popovers.validTipShow({ reference: cell.parentNode, placement, effect: 'error', message, isFixed: true })
    }
    const handleMouseleave = function(event, slot) {
      if (summary) return
      const cell = document.getElementById(row[rowId] + column.columnId)
      table.$emit('cell-mouse-leave', { row, column, rowIndex, columnIndex, cell, event, slot })
      table.$refs.popovers.tipClose()
      message && table.$refs.popovers.validTipClose()
    }

    const handleMouseUp = function(event) {
      const cell = document.getElementById(row[rowId] + column.columnId)
      table.$emit('cell-mouse-up', { column, columnIndex, cell, event, rowIndex })
    }
    const handleMouseDown = function(event) {
      const cell = document.getElementById(row[rowId] + column.columnId)
      table.$emit('cell-mouse-down', { column, columnIndex, cell, event, rowIndex })
    }
    const handleMousemove = function(event) {
      const cell = document.getElementById(row[rowId] + column.columnId)
      table.$emit('cell-mouse-move', { column, columnIndex, cell, event, rowIndex })
    }

    let slot
    if (type === 'expand') {
      slot = expandRender(h)
    } else if (type === 'row-drag') {
      slot = h(RowDrag)
    } else if (row[columnIndex] !== undefined) {
      slot = row[columnIndex]
    } else if (type === 'selection') {
      slot = renderSelection(h)
    } else if (type === 'radio') {
      slot = renderRadio(h)
    } else {
      slot = cellRender(h)
    }

    let groupEl = ''
    if ((row.children && row.children.length || row.hasChildren) && column.prop === groupKey) {
      if (column.groupStatus < 3) {
        column.groupStatus = table.columnGroupIds.indexOf(row[table.rowId]) === -1 ? 1 : 2
      }

      groupEl = <span class={{ 'eff-icon-expand': true, 'is--expanded': column.groupStatus === 2 }} on-click={e => groupClick(e)} />

      if (column.groupStatus === 3) {
        groupEl = <div class='icon-loading'>
          {
            [0, 0, 0, 0, 0, 0, 0, 0].map(v => {
              return <div>
                <span class='blank'></span>
              </div>
            })
          }
        </div>
      }
    }
    return h('div', Object.assign(data, {
      key: groupFloor + '-' + rowIndex + '-' + columnIndex,
      class: columnClass,
      style: Object.assign(column.style || {}, style),
      on: {
        mouseenter: event => handleMouseenter(event, slot),
        mouseleave: event => handleMouseleave(event, slot),
        mouseup: event => handleMouseUp(event),
        mousedown: event => handleMouseDown(event),
        mousemove: event => handleMousemove(event)
      }
    }), [
      groupEl,
      <div ref='cell' id={row[rowId] + column.columnId} class='eff-cell'>
        <span class='eff-cell--label'>{slot}</span>
        {/* {h('form-field', { props: { row, rowIndex, prop, cascade, optionsFunc, rules }}, slot)} */}
      </div>
    ])
  }
}
