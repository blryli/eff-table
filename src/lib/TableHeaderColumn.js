import VCheckbox from '../components/Checkbox'
import { getTextWidth } from '../utils/dom'

export default {
  name: 'TableHeaderColumn',
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    colid: { type: String, default: '' }
  },
  components: { VCheckbox },
  inject: ['table'],
  computed: {
    columnClass() {
      const { fixed, drag, titleClassName } = this.column
      let classes = `eff-table__column`
      if (fixed || drag === false) {
        classes += ' is-drag--filter'
        if (this.table.bodyOverflowX || fixed === 'right') classes += ' is--fixed'
      }
      titleClassName && (classes += ` ${titleClassName}`)
      return classes
    }
  },
  render(h) {
    const { column, columnIndex } = this

    const slot = column.titleRender ? this.titleRender(h, { column, columnIndex }) : column.type === 'selection' ? this.renderSelection(h) : column.type === 'index' ? (column.title || '#') : column.title

    return (
      <div
        class={this.columnClass}
        data-colid={this.colid}
        data-colidx={this.columnIndex}
        style={this.table.setColumnStyle(column, columnIndex)}
        on-mouseenter={event => this.handleMouseenter(event, slot)}
        on-mouseleave={event => this.handleMouseleave(event, slot)}
      >
        <div ref='cell' class='eff-cell'>{slot}</div>
      </div>
    )
  },
  methods: {
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
      if (typeof column.titleRender === 'function') {
        return column.titleRender(h, { column, columnIndex })
      } else {
        console.error('titleRender 必须是函数')
      }
    },
    handleMouseenter() {
      const { cell } = this.$refs
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }

      if (getTextWidth(cell) > this.width) {
        this.table.tipShow({ reference: cell.parentNode, message: [{ type: 'info', message: cell.innerText }] })
      }
    },
    handleMouseleave() {
      this.table.tipClose()
    }
  }
}
