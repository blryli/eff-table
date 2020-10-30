import VCheckbox from '../components/Checkbox'
import { getTextWidth } from '../utils/dom'

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
      const { titleClassName, drag } = this.column

      let classes = `eff-table__column`
      titleClassName && (classes += ` ${titleClassName}`)
      if (drag === false) {
        classes += ' is-drag--filter'
      }
      return classes
    }
  },
  render(h) {
    const { column, columnIndex, bodyColumnIndex } = this
    const { edit: { render } = {}, sortable, title, type } = column

    const slot = column.titleRender ? this.titleRender(h, { column, columnIndex }) : type === 'selection' ? this.renderSelection(h) : type === 'index' ? (title || '#') : title

    return (
      <div
        class={this.columnClass}
        data-colid={this.colid}
        data-colidx={this.columnIndex}
        key={this.colid}
        style={this.table.setColumnStyle(column, bodyColumnIndex)}
        on-mouseenter={event => this.handleMouseenter(event, slot)}
        on-mouseleave={event => this.handleMouseleave(event, slot)}
      >
        <div ref='cell' class={{ 'eff-cell': true, sortable }}>
          <span class='eff-cell--title'>{slot}</span>
          {
            sortable ? <span class='eff-cell--sort'>
              <i
                class={{ 'eff-cell--sort-asc': true, 'is--active': this.sortActive('asc') }}
                on-click={() => this.sortClick('asc')}
              ></i>
              <i
                class={{ 'eff-cell--sort-desc': true, 'is--active': this.sortActive('desc') }}
                on-click={() => this.sortClick('desc')}
              ></i>
            </span> : ''
          }
        </div>
        {
          render && typeof render === 'function' ? <span class='eff-edit' title='可编辑列'></span> : ''
        }
      </div>
    )
  },
  methods: {
    sortActive(od) {
      const { prop, order } = this.table.curSort
      return prop === this.column.prop && order === od
    },
    renderSelection(h) {
      return <v-checkbox
        value={this.table.selectionAll}
        key={this.columnIndex}
        indeterminate={this.table.indeterminate}
        on-change={this.selectionChange}
      />
    },
    selectionChange(val) {
      this.table.$emit('all.selection.change', val)
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
      const { cell } = this.$refs
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }

      if (this.column.width && getTextWidth(cell) > Math.max(this.column.width, 40) || !this.column.width && getTextWidth(cell) > this.table.spaceWidth) {
        this.table.tipShow({ reference: cell.parentNode, message: [{ type: 'info', message: cell.innerText }] })
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
