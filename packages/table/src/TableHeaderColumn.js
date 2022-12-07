import VCheckbox from 'pk/checkbox'
import { columnIsEdit, getFieldValue } from 'pk/utils'
import { textOverflow } from 'pk/utils/dom'
import Icon from 'pk/icon'
import XEUtils from 'xe-utils'

export default {
  name: 'TableHeaderColumn',
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    bodyColumnIndex: { type: Number, default: 0 },
    colid: { type: String, default: '' },
    isChecked: Boolean
  },
  inject: ['table'],
  functional: true,
  render(h, context) {
    const { props, data, parent, injections } = context
    const { table } = injections
    const { drag: tableDrag, edit: tableEdit, tableId, isSpanMethod, tableData } = table
    const { column, columnIndex, colid, isChecked } = props
    const { sortable, title, titlePrefix, titleSuffix, type, rules = [], headerAlign } = column
    const { icon: prefixIcon = 'question' } = titlePrefix || {}
    const { icon: suffixIcon = 'question' } = titleSuffix || {}
    const renderId = `header-column-${tableId}-${colid}`

    const isRequired = Boolean(rules.find(d => d.required))

    const columnStyle = {}
    const columnWidth = table.getColumnWidth(column)
    columnStyle.minWidth = columnWidth + 'px'
    columnStyle.maxWidth = columnWidth + 'px'
    if (!column.parent && columnIndex === 0) {
      columnStyle.borderLeft = 0
    }

    const { titleClassName, drag, edit, fixed, prop, filter, filters } = column

    let columnClass = `eff-table__column`
    // 对齐方式
    if (headerAlign) {
      columnClass += ` is--align-${headerAlign || 'left'}`
    }
    titleClassName && (columnClass += ` ${titleClassName}`)
    edit && (columnClass += ` col-edit`)
    const isDrag = tableDrag && drag !== false
    if (fixed && isDrag) {
      columnClass += ' col-fixed'
      if (drag === false || !prop) {
        columnClass += ' fixed-hidden'
      }
    }
    if (isDrag && !fixed && !isSpanMethod) {
      columnClass += ' col-drag'
    }
    if (type) {
      columnClass += ' col-' + type
    }
    if (isChecked) {
      columnClass += ' is--checked'
    }
    if (table.isTypeColumn(column)) {
      columnClass += ' is--type-column'
    }
    if (columnIndex === table.tableColumns.length - 1) {
      columnClass += ' is--last-column'
    }

    const sortActive = (order) => {
      const findColumn = table.sorts.find(d => [d].some(s => s === column))
      return findColumn && findColumn.order === order
    }
    const renderSelection = (h) => {
      return h(VCheckbox, {
        props: { value: table.selectionAll, indeterminate: table.indeterminate },
        key: columnIndex,
        on: { change: table.allselectionChange }
      })
    }
    const titleRender = (h, { column, columnIndex }) => {
      if (column.titleRender) {
        if (typeof column.titleRender === 'function') {
          return column.titleRender(h, { title: column.title, column, columnIndex })
        } else {
          console.error('titleRender 必须是函数')
        }
      }
      return false
    }
    const handleMouseenter = () => {
      const cell = document.getElementById(renderId)
      const cellTitle = cell.querySelector('.eff-cell--title')
      if (!cell) return
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }
      if (textOverflow(cellTitle)) {
        table.$refs.popovers.tipShow({ reference: cell.parentNode, effect: 'dark', message: cellTitle.innerText })
      }
    }
    const handleMouseleave = () => {
      table.$refs.popovers.tipClose()
    }
    const sortClick = (order) => {
      const { sortChange } = parent
      if (!sortChange) return
      column.order = column.order && column.order === order ? '' : order
      sortChange(column)
    }
    // filter
    if (filter) {
      table.useFilter = true
    }
    const filterId = table.tableId + colid + 'filter'
    const filterClick = () => {
      const reference = document.getElementById(filterId)
      let message = []
      if (filters) {
        message = filters.map(d => {
          const { label, value } = d
          if (!value || !label) return null
          return d
        })
      } else {
        message = [...new Set(tableData.map(d => getFieldValue(d, prop)))].map(value => {
          if (!value) return null
          return { label: value, value, checked: false }
        })
        column.filters = message.filter(d => d)
        table.tableColumns = [...table.tableColumns]
      }
      table.$refs.filter.toggleTipShow({ reference, showAllways: true, placement: 'bottom', column })
    }

    const slot = type === 'expand' ? '' : column.titleRender ? titleRender(h, { column, columnIndex }) : type === 'selection' ? renderSelection(h) : type === 'index' ? (title || '#') : title

    const renderHelp = (title, icon) => {
      const { message } = title || {}
      return message ? h('help', {
        class: 'eff-cell--title-help',
        props: { effect: 'dark', message }
      }, [h(Icon, { props: { icon }})]) : ''
    }

    return h('div', XEUtils.merge(data, {
      key: colid,
      class: columnClass,
      style: columnStyle,
      attrs: { 'data-colid': colid, 'data-colidx': columnIndex },
      on: {
        mouseenter: event => handleMouseenter(event, slot),
        mouseleave: event => handleMouseleave(event, slot)
      }
    }), [
      <div id={renderId} class={{ 'eff-cell': true, sortable }}>
        {
          isRequired ? <i class='eff-cell--required' /> : ''
        }
        {
          tableEdit && columnIsEdit(column) ? <i class='eff-icon-edit' title='可编辑列' /> : ''
        }
        {
          renderHelp(titlePrefix, prefixIcon)
        }
        <span class='eff-cell--title'>{slot}</span>
        {
          renderHelp(titleSuffix, suffixIcon)
        }
        {
          sortable ? <span class='eff-cell--sort'>
            <i
              class={{ 'eff-cell--sort-asc': true, 'is--active': sortActive('asc') }}
              on-click={() => sortClick('asc')}
            ></i>
            <i
              class={{ 'eff-cell--sort-desc': true, 'is--active': sortActive('desc') }}
              on-click={() => sortClick('desc')}
            ></i>
          </span> : ''
        }
        {
          filter ? <icon id={filterId} icon='filter' style={{ color: filter && (column.filters || []).find(d => d.checked) ? '#409eff' : '' }} on-click={filterClick} /> : ''
        }
      </div>
    ]
    )
  }
}
