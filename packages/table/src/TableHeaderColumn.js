import VCheckbox from 'pk/checkbox'
import { getTextWidth } from 'pk/utils/dom'

export default {
  name: 'TableHeaderColumn',
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    bodyColumnIndex: { type: Number, default: 0 },
    colid: { type: String, default: '' }
  },
  components: { VCheckbox },
  inject: ['table'],
  computed: {
    columnClass() {
      const { titleClassName, drag, fixed, edit: { render: editRender } = {}} = this.column

      let classes = `eff-table__column`
      titleClassName && (classes += ` ${titleClassName}`)
      editRender && (classes += ` col-edit`)
      if (drag === false || fixed) {
        classes += ' is-drag--filter'
      }
      return classes
    }
  },
  render(h) {
    const { table, column, columnIndex, columnClass, colid, bodyColumnIndex, titleRender, renderSelection, handleMouseenter, handleMouseleave, sortActive, sortClick } = this
    const { sortable, title, type, rules = [] } = column

    const slot = type === 'expand' ? '' : column.titleRender ? titleRender(h, { column, columnIndex }) : type === 'selection' ? renderSelection(h) : type === 'index' ? (title || '#') : title
    const required = Boolean(rules.find(d => d.required))

    return (
      <div
        class={columnClass}
        data-colid={colid}
        data-colidx={columnIndex}
        key={colid}
        style={table.setColumnStyle(column, bodyColumnIndex)}
        on-mouseenter={event => handleMouseenter(event, slot)}
        on-mouseleave={event => handleMouseleave(event, slot)}
      >
        <div ref='cell' class={{ 'eff-cell': true, sortable }}>
          {
            required ? <i class='eff-cell--required' /> : ''
          }
          <span class='eff-cell--title'>{slot}</span>
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
    sortActive(od) {
      const { table, column } = this
      const { prop, order } = table.curSort
      return prop === column.prop && order === od
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
      const { tipShow, spaceWidth } = table
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }

      if (width && getTextWidth(cell) > Math.max(width, 40) || !width && getTextWidth(cell) > spaceWidth) {
        tipShow({ reference: cell.parentNode, message: [{ type: 'info', message: cell.innerText }] })
      }
    },
    handleMouseleave() {
      this.table.tipClose()
    },
    sortClick(order) {
      const { column, column: { prop }} = this
      this.$emit('sort-change', { column, prop, order })
    }
  }
}
