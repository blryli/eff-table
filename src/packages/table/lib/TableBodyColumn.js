import VCheckbox from '../components/Checkbox/index.vue'
import { getTextWidth } from '../utils/dom'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'TableBodyColumn',
  components: { VCheckbox },
  inject: ['table'],
  props: {
    row: { type: Object, default: () => {} },
    rowIndex: { type: Number, default: 0 },
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    message: { type: Object, default: () => {} },
    fixed: { type: String, default: '' }
  },
  emits: ['cell-mouse-enter', 'cell-mouse-leave'],
  data() {
    return {
      checked: false,
      expanded: (this.table.expands.find(d => d.rowIndex === this.rowIndex) || {}).expanded || false
    }
  },
  computed: {
    columnClass() {
      let classes = `eff-table__column`
      const { row, column, rowIndex, columnIndex, table } = this
      const { className } = column
      const { cellClassName } = table
      const { message } = this.message || {}
      if (className) {
        if (typeof className === 'function') {
          const c = className({ row, column, rowIndex, columnIndex })
          c && (classes += ` ${c}`)
        } else {
          classes += ` ${className}`
        }
      }
      if (message) classes += ' is--message'
      if (cellClassName) {
        if (typeof cellClassName === 'function') {
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
    renderSelection() {
      const { table, rowIndex, selectionChange } = this
      return h(VCheckbox,
        {
          modelValue: table.isChecked(rowIndex),
          key: rowIndex,
          onChange: selectionChange
        }
      )
    },
    selectionChange(selected) {
      const { table, rowIndex } = this
      table.rowSelectionChange(rowIndex, selected)
    },
    cellRender() {
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
    expandRender() {
      const { expanded, expandClick } = this
      return h('span', {
        class: { 'eff-icon-expand': true, 'is-expanded': expanded },
        onClick: expandClick
      })
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
    },
    expandClick() {
      const { rowIndex, expanded, table } = this
      this.expanded = !expanded
      table.expandChange({ rowIndex, expanded: this.expanded })
    }
  },
  render() {
    const { row, rowIndex, column, columnIndex, table, fixed, handleMouseenter, handleMouseleave } = this
    const { cellRender, type, prop } = column
    // row[columnIndex] summary合计列
    const slot = type === 'expand' ? this.expandRender(h) : row[columnIndex] !== undefined ? row[columnIndex] : cellRender ? this.cellRender(h) : (type === 'selection' ? this.renderSelection(h) : type === 'index' ? rowIndex + 1 : prop ? row[prop] : '')
    return (
      h('div',
        {
          class: this.columnClass,
          key: rowIndex + '-' + columnIndex,
          style: table.setColumnStyle(column, columnIndex, fixed),
          onMouseenter: event => handleMouseenter(event, slot),
          onMouseleave: event => handleMouseleave(event, slot)
        },
        h('div',
          {
            ref: 'cell',
            class: 'eff-cell'
          },
          h('span', { class: 'eff-cell--label' }, slot)
        )
      )
    )
  }
})
