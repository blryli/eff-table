import VCheckbox from 'pk/checkbox'
import { columnIsEdit } from 'pk/utils'
import { getTextWidth } from 'pk/utils/dom'
import PrefixSuffix from 'pk/prefix-suffix'
import Help from 'pk/help'
import Icon from 'pk/icon'

export default {
  name: 'TableHeaderColumn',
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    bodyColumnIndex: { type: Number, default: 0 },
    colid: { type: String, default: '' }
  },
  components: { VCheckbox, PrefixSuffix, Help, Icon },
  inject: ['table'],
  computed: {
    columnClass() {
      const { table, column } = this
      const { drag: tableDrag } = table
      const { titleClassName, drag, edit, fixed, prop, type } = column

      let classes = `eff-table__column`
      titleClassName && (classes += ` ${titleClassName}`)
      edit && (classes += ` col-edit`)
      const isDrag = tableDrag && drag !== false
      if (fixed && isDrag) {
        classes += ' col-fixed'
        if (drag === false || !prop) {
          classes += ' fixed-hidden'
        }
      }
      if (isDrag && !fixed) {
        classes += ' col-drag'
      }
      if (type) {
        classes += ' col-' + type
      }
      return classes
    },
    columnStyle() {
      const { table, column, columnIndex } = this
      const style = {}
      const { width = 0 } = column
      const { spaceWidth } = table
      const columnWidth = Math.max(width || spaceWidth, 40)
      style.minWidth = columnWidth + 'px'
      style.maxWidth = columnWidth + 'px'
      if (!column.parent && columnIndex === 0) {
        style.borderLeft = 0
      }
      return style
    }
  },
  render(h) {
    const { column, columnIndex, columnClass, columnStyle, colid, titleRender, renderSelection, handleMouseenter, handleMouseleave, sortActive, sortClick } = this
    const { sortable, title, titlePrefix, titleSuffix, type, rules = [] } = column
    const { icon: prefixIcon = 'question' } = titlePrefix || {}
    const { icon: suffixIcon = 'question' } = titleSuffix || {}

    const slot = type === 'expand' ? '' : column.titleRender ? titleRender(h, { column, columnIndex }) : type === 'selection' ? renderSelection(h) : type === 'index' ? (title || '#') : title
    const required = Boolean(rules.find(d => d.required))

    return (
      <div
        class={columnClass}
        data-colid={colid}
        data-colidx={columnIndex}
        key={colid}
        style={columnStyle}
        on-mouseenter={event => handleMouseenter(event, slot)}
        on-mouseleave={event => handleMouseleave(event, slot)}
      >
        <div ref='cell' class={{ 'eff-cell': true, sortable }}>
          {
            required ? <i class='eff-cell--required' /> : ''
          }
          {
            !type && columnIsEdit(column) ? <i class='eff-icon-edit' title='可编辑列' /> : ''
          }
          {
            titlePrefix && titlePrefix.message ? <Help class='eff-cell--title-help' effect='dark' message={titlePrefix.message}><Icon icon={prefixIcon}/></Help> : ''
          }
          <span class='eff-cell--title'>{slot}</span>
          {
            titleSuffix && titleSuffix.message ? <Help class='eff-cell--title-help' effect='dark' message={titleSuffix.message}><Icon icon={suffixIcon}/></Help> : ''
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
      </div>
    )
  },
  methods: {
    sortActive(order) {
      const { table, column } = this
      const findColumn = table.sorts.find(d => [d].some(s => s === column))
      return findColumn && findColumn.order === order
    },
    renderSelection(h) {
      const { table, columnIndex, selectionChange } = this
      return <v-checkbox
        value={table.selectionAll}
        key={columnIndex}
        indeterminate={table.indeterminate}
        on-change={selectionChange}
      />
    },
    selectionChange(val) {
      this.table.allselectionChange(val)
    },
    titleRender(h, { column, columnIndex }) {
      if (column.titleRender) {
        if (typeof column.titleRender === 'function') {
          return column.titleRender(h, { title: column.title, column, columnIndex })
        } else {
          console.error('titleRender 必须是函数')
        }
      }
      return false
    },
    handleMouseenter() {
      const { table, column: { width }, $refs: { cell }} = this
      const { spaceWidth } = table
      if (!cell) return
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }

      if (width && getTextWidth(cell) > Math.max(width, 40) || !width && getTextWidth(cell) > spaceWidth) {
        table.$refs.popovers.tipShow({ reference: cell.parentNode, message: [{ type: 'info', message: cell.innerText }] })
      }
    },
    handleMouseleave() {
      this.table.$refs.popovers.tipClose()
    },
    sortClick(order) {
      const { column } = this
      column.order = column.order && column.order === order ? '' : order
      this.$emit('sort-change', column)
    }
  }
}
