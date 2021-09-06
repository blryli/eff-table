import VCheckbox from 'pk/checkbox'
import VRadio from 'pk/radio'
import { getTextWidth, eqCellValue } from 'pk/utils/dom'
import { renderer } from 'pk/utils/render'
import RowDrag from 'pk/icon/src/rowDrag'
import { getFieldValue, initField, isVNode } from 'pk/utils'
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
    rowid: { type: String, default: '' },
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
    const { vue, row, rowid, rowIndex, column, columnIndex, disabled, groupFloor, groupKey, summary } = props
    const { type, prop, className } = column
    const { spaceWidth, rowId, cellClassName, editStore: { updateList }, copy } = table
    const _rowId = row[rowId]
    // 为特殊prop时，初始化值
    if (vue && prop && !(prop in row) && !column.initField && getFieldValue(row, prop) === undefined) {
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

    let columnClass = `eff-table__column `
    // 复制功能
    if (copy && !summary) {
      const { startRow, endRow, startColumn, endColumn, borderStyle } = table.$refs.selectRange.selectRengeStore
      const border = `2px ${borderStyle} #409eff`
      const id = `${table.tableId}_${rowIndex + 1}-${columnIndex + 1}`
      const commitRange = () => table.$refs.selectRange.setRowMap({ id, row, rowIndex, column, columnIndex, prop })
      let isCommit = false
      if (columnIndex === startColumn && rowIndex >= startRow && rowIndex <= endRow) {
        commitRange()
        isCommit = true
        if (borderStyle === 'dashed') {
          columnClass += ' border-move-left'
        } else {
          style.borderLeft = border
        }
      }
      if (rowIndex === startRow && columnIndex >= startColumn && columnIndex <= endColumn) {
        commitRange()
        isCommit = true
        if (borderStyle === 'dashed') {
          columnClass += ' border-move-top'
        } else {
          style.borderTop = border
        }
      }
      if (columnIndex === endColumn && rowIndex >= startRow && rowIndex <= endRow) {
        commitRange()
        isCommit = true
        if (borderStyle === 'dashed') {
          columnClass += ' border-move-right'
        } else {
          style.borderRight = border
        }
      }
      if (rowIndex === endRow && columnIndex >= startColumn && columnIndex <= endColumn) {
        commitRange()
        isCommit = true
        if (borderStyle === 'dashed') {
          columnClass += ' border-move-bottom'
        } else {
          style.borderBottom = border
        }
      }
      if (!isCommit) {
        table.$refs.selectRange.deleteRowMap(id)
      }
    }

    // 处理class
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

    const cellId = row[rowId] + column.columnId

    const { selectable } = column
    const isDisabled = XEUtils.isFunction(selectable) ? selectable({ row, rowIndex, rowid }) : false

    const renderSelection = function() {
      return h(VCheckbox, {
        props: { value: table.isChecked(row), disabled: isDisabled },
        key: _rowId,
        on: { change: selected => table.rowSelectionChange(row, selected) }
      })
    }
    const renderRadio = function(h) {
      return h(VRadio, {
        props: { value: table.isChecked(row), disabled: isDisabled },
        key: _rowId,
        on: { change: selected => table.rowSelectionChange(row, selected, true) }
      })
    }
    const cellRender = function() {
      const { cellRender, prop, config = {}, type, edit: { render } = {}} = column
      const renderCell = (cellRender) => {
        // 处理动态渲染器
        const dynamicConfig = {}
        if (XEUtils.isFunction(render)) {
          const renderFunc = render(h, { row, sourceRow, rowIndex, column, columnIndex, prop })
          if (!isVNode(renderFunc)) {
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
        // props支持函数
        const { props } = renderOpts
        if (props && typeof props === 'function') {
          renderOpts.props = props(params)
        }
        return compConf ? compConf.renderDefault(h, renderOpts, params) : type === 'index' ? rowid : prop ? getFieldValue(row, prop) : ''
      }
      if (XEUtils.isFunction(cellRender)) {
        const cellRenderFunc = cellRender(h, { row, rowIndex, column, columnIndex, prop })
        return isVNode(cellRenderFunc) ? (cellRenderFunc || '') : XEUtils.isObject(cellRenderFunc) ? renderCell(cellRenderFunc) : cellRenderFunc
      } else {
        return renderCell(cellRender)
      }
    }
    const rowExpanded = table.expands.find(d => d.rowId === row[rowId]) || {}
    const expandClick = function(e) {
      !disabled && table.expandChange({ rowId: row[rowId], height: 0 })
    }
    const expandRender = function() {
      const expand = <span class='eff-table--expand' on-click={e => expandClick(e)}>
        <span class={{ 'eff-icon--arrow': true, 'is--expanded': rowExpanded.expanded, 'is--disabled': disabled }} />
      </span>

      return expand
    }
    const handleMouseenter = function(event, slot) {
      if (summary) return
      const cell = document.getElementById(cellId)
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
      const cell = document.getElementById(cellId)
      table.$emit('cell-mouse-leave', { row, column, rowIndex, columnIndex, cell, event, slot })
      table.$refs.popovers.tipClose()
      message && table.$refs.popovers.validTipClose()
    }

    const handleMouseUp = function(event) {
      if (summary) return
      const cell = document.getElementById(cellId)
      table.$emit('cell-mouse-up', { column, columnIndex, cell, event, rowIndex })
    }
    const handleMouseDown = function(event) {
      if (summary) return
      const cell = document.getElementById(cellId)
      table.$emit('cell-mouse-down', { column, columnIndex, cell, event, rowIndex })
    }
    const handleMousemove = function(event) {
      if (summary) return
      const cell = document.getElementById(cellId)
      table.$emit('cell-mouse-move', { column, columnIndex, cell, event, rowIndex })
    }

    // 表格树 tree
    const { lazy, loadMethod, children = 'children' } = table.treeConfig

    const childs = row[children] || []
    const groupClick = function(e) {
      vue.$set(table.treeIds, _rowId, !table.treeIds[_rowId])
      if (lazy && !childs.length && XEUtils.isFunction(loadMethod)) { // 异步加载
        loadMethod(row).then(res => {
          vue.$set(row, children, res)
        })
      }
    }

    let treeSwitch = ''
    if ((childs.length || row.hasChildren) && column.prop === groupKey) {
      treeSwitch = <span class='eff-table--expand' on-click={e => groupClick(e)}>
        <span class={{ 'eff-icon--arrow': true, 'is--expanded': table.treeIds[_rowId] }} />
      </span>

      if (lazy) {
        treeSwitch = <div class='icon-loading'>
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
      treeSwitch,
      <div id={cellId} class='eff-cell'>
        <span class='eff-cell--label'>{slot}</span>
        {/* {h('form-field', { props: { row, rowIndex, prop, cascade, optionsFunc, rules }}, slot)} */}
      </div>
    ])
  }
}
