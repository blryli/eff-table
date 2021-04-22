import VCheckbox from '../components/Checkbox'
import VRadio from '../components/Radio'
import { getTextWidth } from '../utils/dom'
import { renderer } from 'core/render'

export default {
  name: 'TableBodyColumn',
  props: {
    row: { type: Object, default: () => {} },
    rowIndex: { type: Number, default: 0 },
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    message: { type: Object, default: () => {} },
    fixed: { type: String, default: '' },
    disabled: Boolean
  },
  components: { VCheckbox, VRadio },
  inject: ['table'],
  data() {
    return {
      style: {},
      checked: false,
      expanded: (this.table.expands.find(d => d.rowIndex === this.rowIndex) || {}).expanded || false
    }
  },
  render(h) {
    const { row, rowIndex, column, columnIndex, handleMouseenter, handleMouseleave, getStyle, handleMouseUp, handleMouseDown, handleMousemove } = this
    const { type } = column
    // row[columnIndex] summary合计列
    let slot
    if (type === 'expand') {
      slot = this.expandRender(h)
    } else if (row[columnIndex] !== undefined) {
      slot = row[columnIndex]
    } else if (type === 'selection') {
      slot = this.renderSelection(h)
    } else if (type === 'radio') {
      slot = this.renderRadio(h)
    } else {
      slot = this.cellRender(h)
    }

    // const slot = type === 'expand' ? this.expandRender(h) : row[columnIndex] !== undefined ? row[columnIndex] : type === 'selection' ? this.renderRadio(h) : this.cellRender(h)

    return (
      <div
        class={this.columnClass}
        key={rowIndex + '-' + columnIndex}
        style={getStyle()}
        on-mouseenter={event => handleMouseenter(event, slot)}
        on-mouseleave={event => handleMouseleave(event, slot)}

        on-mouseup={event => handleMouseUp(event)}
        on-mousedown={event => handleMouseDown(event)}
        on-mousemove={event => handleMousemove(event)}
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
      const { row, column, rowIndex, columnIndex, table } = this
      const { className, prop } = column
      const { cellClassName, editStore: { updateList }, rowId } = table
      const { message } = this.message || {}
      const sourceRow = updateList.find(d => d[rowId] === row[rowId])
      if (prop && sourceRow && sourceRow[prop] !== row[prop]) {
        classes += ' is--dirty'
      }
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
    getStyle() {
      const defaultStyle = this.table.setColumnStyle(this.column, this.columnIndex, this.fixed)
      return Object.assign(defaultStyle, this.style)
    },
    renderSelection(h) {
      const { table, row } = this
      return <v-checkbox
        value={table.isChecked(row)}
        key={row[table.rowId]}
        on-change={selected => table.rowSelectionChange(row, selected)}
      />
    },
    renderRadio(h) {
      const { table, row } = this
      return <v-radio
        value={table.isChecked(row)}
        key={row[table.rowId]}
        on-change={selected => table.rowSelectionChange(row, selected, true)}
      />
    },
    cellRender(h) {
      const { table, row, rowIndex, column, columnIndex, disabled } = this
      const { cellRender, prop, config, type } = column
      if (typeof cellRender === 'function') {
        return cellRender(h, { row, rowIndex, column, columnIndex, prop })
      } else {
        const renderOpts = Object.assign({}, config, cellRender)
        if (disabled) {
          if (!renderOpts.props) renderOpts.props = {}
          renderOpts.props.disabled = true
        }
        const { name, tag } = renderOpts
        const compConf = renderer.get(name) || tag && renderer.get('default')
        return compConf ? compConf.renderDefault(h, renderOpts, { table, data: row, row, rowIndex, column, columnIndex, prop }) : type === 'index' ? rowIndex + 1 : prop ? row[prop] : ''
      }
    },
    expandRender() {
      const { expanded, disabled, expandClick } = this
      return <span class={{ 'eff-icon-expand': true, 'is--expanded': expanded, 'is--disabled': disabled }} on-click={e => !disabled && expandClick(e)} />
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
    },

    handleMouseUp(event) {
      const { column, rowIndex, columnIndex, table, $refs: { cell }} = this
      table.$emit('cell-mouse-up', { column, columnIndex, cell, event, rowIndex })
    },
    handleMouseDown(event) {
      const { column, rowIndex, columnIndex, table, $refs: { cell }} = this
      table.$emit('cell-mouse-down', { column, columnIndex, cell, event, rowIndex })
    },
    handleMousemove(event) {
      const { column, rowIndex, columnIndex, table, $refs: { cell }} = this
      table.$emit('cell-mouse-move', { column, columnIndex, cell, event, rowIndex })
    }

  }
}
