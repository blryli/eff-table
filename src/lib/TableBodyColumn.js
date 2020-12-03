import VCheckbox from '../components/Checkbox'
import { getTextWidth } from '../utils/dom'

export default {
  name: 'TableBodyColumn',
  props: {
    row: { type: Object, default: () => {} },
    rowIndex: { type: Number, default: 0 },
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    message: { type: Object, default: () => {} },
    fixed: { type: String, default: '' }
  },
  components: { VCheckbox },
  inject: ['table'],
  data() {
    return {
      checked: false
    }
  },
  render(h) {
    const { row, rowIndex, column, columnIndex, table, fixed, handleMouseenter, handleMouseleave } = this
    const { cellRender, type, prop } = column
    // row[columnIndex] summary合计列
    const slot = row[columnIndex] !== undefined ? row[columnIndex] : cellRender ? this.cellRender(h) : (type === 'selection' ? this.renderSelection(h) : type === 'index' ? rowIndex + 1 : prop ? row[prop] : '')
    return (
      <div
        class={this.columnClass}
        key={rowIndex + '-' + columnIndex}
        style={table.setColumnStyle(column, columnIndex, fixed)}
        on-mouseenter={event => handleMouseenter(event, slot)}
        on-mouseleave={event => handleMouseleave(event, slot)}
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
      const { className } = this.column
      const { cellClassName } = this.table
      const { message } = this.message || {}
      if (className) {
        if (typeof className === 'function') {
          const { row, column, rowIndex, columnIndex } = this
          const c = className({ row, column, rowIndex, columnIndex })
          c && (classes += ` ${c}`)
        } else {
          classes += ` ${className}`
        }
      }
      if (message) classes += ' is--message'
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
      const { table, rowIndex, selectionChange } = this
      return <v-checkbox
        value={table.isChecked(rowIndex)}
        key={rowIndex}
        on-change={selectionChange}
      />
    },
    selectionChange(selected) {
      const { table, rowIndex } = this
      table.$emit('row.selection.change', rowIndex, selected)
    },
    cellRender(h) {
      const { row, rowIndex } = this
      const { column, columnIndex } = this
      const { cellRender, prop } = column
      if (cellRender) {
        if (typeof cellRender === 'function') {
          return cellRender(h, { row, rowIndex, column, columnIndex, prop })
        } else {
          console.error('cellRender 必须是函数')
        }
      }
      return false
    },
    handleMouseenter(event, slot) {
      if (this.$parent.summary) return
      const { row, column, rowIndex, columnIndex, table, $refs: { cell }} = this
      table.$emit('cell-mouse-enter', { row, column, rowIndex, columnIndex, cell, event, slot })
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }

      const messages = []
      if (column.width && getTextWidth(cell) > Math.max(column.width, 40) || !column.width && getTextWidth(cell) > table.spaceWidth) {
        messages.push({ type: 'info', message: cell.innerText })
      }
      if (this.message && this.message.message) {
        messages.push({ type: 'error', message: this.message.message })
      }
      if (messages.length) {
        table.tipShow({ reference: cell.parentNode, message: messages })
      }
    },
    handleMouseleave(event, slot) {
      if (this.$parent.summary) return
      const { row, column, rowIndex, columnIndex, table, $refs: { cell }} = this
      table.$emit('cell-mouse-leave', { row, column, rowIndex, columnIndex, cell, event, slot })
      table.tipClose()
    }
  }
}
