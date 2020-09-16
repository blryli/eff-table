import VCheckbox from '../components/Checkbox'
import { getTextWidth } from '../utils/dom'

export default {
  name: 'TableBodyColumn',
  props: {
    row: { type: Object, default: () => {} },
    rowIndex: { type: Number, default: 0 },
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    message: { type: Object, default: () => {} }
  },
  components: { VCheckbox },
  inject: ['table'],
  data() {
    return {
      checked: false
    }
  },
  render(h) {
    const { cellRender, type, prop } = this.column
    const slot = this.row[this.columnIndex] !== undefined ? this.row[this.columnIndex] : cellRender ? this.cellRender(h) : (type === 'selection' ? this.renderSelection(h) : type === 'index' ? this.rowIndex + 1 : prop ? this.row[prop] : '')
    return (
      <div
        class={this.columnClass}
        style={this.table.setColumnStyle(this.column, this.columnIndex)}
        on-mouseenter={event => this.handleMouseenter(event, slot)}
        on-mouseleave={event => this.handleMouseleave(event, slot)}
      >
        <div ref='cell' class='eff-cell'>
          <span class='eff-cell--label'>{slot}</span>
        </div>
      </div>
    )
  },
  computed: {
    columnClass() {
      let classes = `eff-table__column`
      const { fixed, className } = this.column
      const { cellClassName } = this.table
      const { message } = this.message || {}
      if (message) classes += ' is--message'
      if (fixed && this.table.bodyOverflowX) {
        classes += ' is--fixed'
      }
      className && (classes += ` ${className}`)
      if (cellClassName) {
        if (typeof cellClassName === 'function') {
          const { row, column, rowIndex, columnIndex } = this
          const c = cellClassName({ row, column, rowIndex, columnIndex })
          c && (classes += ` ${c}`)
        } else {
          classes += ` ${cellClassName}`
        }
      }
      return classes
    }
  },
  methods: {
    renderSelection(h) {
      return <v-checkbox
        value={this.table.isChecked(this.rowIndex)}
        key={this.rowIndex}
        on-change={this.selectionChange}
      />
    },
    selectionChange(selected) {
      this.table.$emit('row.selection.change', this.rowIndex, selected)
    },
    cellRender(h) {
      if (this.column.cellRender) {
        if (typeof this.column.cellRender === 'function') {
          return this.column.cellRender(h, { row: this.row, rowIndex: this.rowIndex })
        } else {
          console.error('cellRender 必须是函数')
        }
      }
      return false
    },
    handleMouseenter(event, slot) {
      if (this.$parent.summary) return
      const { cell } = this.$refs
      const { row, column, rowIndex, columnIndex } = this
      this.table.$emit('cell-mouse-enter', { row, column, rowIndex, columnIndex, cell, event, slot })
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }

      const messages = []
      if (column.width && getTextWidth(cell) > Math.max(column.width, 40) || !column.width && getTextWidth(cell) > this.table.spaceWidth) {
        messages.push({ type: 'info', message: cell.innerText })
      }
      if (this.message && this.message.message) {
        messages.push({ type: 'error', message: this.message.message })
      }
      if (messages.length) {
        this.table.tipShow({ reference: cell.parentNode, message: messages })
      }
    },
    handleMouseleave(event, slot) {
      if (this.$parent.summary) return
      const { row, column, rowIndex, columnIndex } = this
      const { cell } = this.$refs
      this.table.$emit('cell-mouse-leave', { row, column, rowIndex, columnIndex, cell, event, slot })
      this.table.tipClose()
    }
  }
}
