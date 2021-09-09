import VCheckbox from 'pk/checkbox'
import { columnIsEdit } from 'pk/utils'
import { getTextWidth } from 'pk/utils/dom'
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
    const { column, columnIndex, colid, isChecked } = props
    const { sortable, title, titlePrefix, titleSuffix, type, rules = [] } = column
    const { icon: prefixIcon = 'question' } = titlePrefix || {}
    const { icon: suffixIcon = 'question' } = titleSuffix || {}
    const renderId = 'header-column-' + colid

    const isRequired = Boolean(rules.find(d => d.required))

    const columnStyle = {}
    const { width = 0 } = column
    const { spaceWidth } = table
    const columnWidth = Math.max(width || spaceWidth, 40)
    columnStyle.minWidth = columnWidth + 'px'
    columnStyle.maxWidth = columnWidth + 'px'
    if (!column.parent && columnIndex === 0) {
      columnStyle.borderLeft = 0
    }

    const { drag: tableDrag } = table
    const { titleClassName, drag, edit, fixed, prop } = column

    let columnClass = `eff-table__column`
    titleClassName && (columnClass += ` ${titleClassName}`)
    edit && (columnClass += ` col-edit`)
    const isDrag = tableDrag && drag !== false
    if (fixed && isDrag) {
      columnClass += ' col-fixed'
      if (drag === false || !prop) {
        columnClass += ' fixed-hidden'
      }
    }
    if (isDrag && !fixed) {
      columnClass += ' col-drag'
    }
    if (type) {
      columnClass += ' col-' + type
    }
    if (isChecked) {
      columnClass += ' is--checked'
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
      if (!cell) return
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }
      // console.log(getTextWidth(cell), cell.getBoundingClientRect().width)
      if (getTextWidth(cell) > cell.getBoundingClientRect().width) {
        table.$refs.popovers.tipShow({ reference: cell.parentNode, message: [{ type: 'info', message: cell.innerText }] })
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

    const slot = type === 'expand' ? '' : column.titleRender ? titleRender(h, { column, columnIndex }) : type === 'selection' ? renderSelection(h) : type === 'index' ? (title || '#') : title

    const renderHelp = (title, icon) => {
      const { message } = title || {}
      return message ? h('help', {
        class: 'eff-cell--title-help',
        props: { effect: 'dark', message }
      }, [h(Icon, { props: { icon }})]) : ''
    }

    // const titleWidth = () => {
    //   const { titleWidth, form, required, titlePrefix, titleSuffix } = this
    //   let width = parseInt(titleWidth || form.titleWidth || 80)
    //   if (required) width -= 10
    //   if (titlePrefix) width -= 16
    //   if (titleSuffix) width -= 16
    //   return width - 12
    // }

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
          columnIsEdit(column) ? <i class='eff-icon-edit' title='可编辑列' /> : ''
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
      </div>
    ]
    )
  }
}
