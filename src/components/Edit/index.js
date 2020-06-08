import { on, off, getKeysStr, debounce } from 'utils/dom'
import { getTableNode, isOverflow, shake } from './dom'

export default {
  name: 'TableEdit',
  props: {
    columns: { type: Array, default: () => [] }
  },
  data() {
    return {
      column: null,
      show: false,
      rowIndex: 0,
      cell: null,
      oldCell: null,
      placement: '',
      component: null,
      handleType: null,
      scroll: {
        scrollLeft: 0,
        scrollTop: 0
      }
    }
  },
  inject: ['table'],
  computed: {
    editRender() {
      const { edit: { render } = {}} = this.column || {}
      return render && typeof render === 'function' && render(this.$createElement, { rowIndex: this.rowIndex }) || ''
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.$emit('editOpen')
      } else {
        this.component && this.component.close && this.component.close()
        this.handleValidate()
        this.placement = ''
        this.column = null
        this.cell = null
        this.$emit('editClose')
      }
    },
    cell(val, oldVal) {
      this.oldCell = oldVal
    }
  },
  mounted() {
    on(window, 'mousedown', this.handleWindowMousedown)
    on(window, 'keyup', this.handleWindowKeyup)
    on(window, 'resize', this.close)
    on(document.getElementById('app-container'), 'scroll', this.close)
    this.$nextTick(() => {
      this.table.$on('cell-click', this.handleEditCell)

      this.wrapper = this.table.$el.querySelector('.eff-table__body-wrapper')
      this.body = this.wrapper.querySelector('.eff-table__body')
      on(this.wrapper, 'scroll', debounce(this.wrapperScroll, 50))
    })
  },
  beforeDestroy() {
    off(window, 'mousedown', this.handleWindowMousedown)
    off(window, 'keyup', this.handleWindowKeyup)
    off(window, 'resize', this.handleWindowResize)
    off(document.getElementById('app-container'), 'scroll', this.close)
    this.table.$off('cell-click', this.handleEditCell)
    off(this.wrapper, 'scroll', debounce(this.wrapperScroll, 50))
  },
  methods: {
    handleValidate() {
      const { prop, validator: { rule, field } = {}} = this.column || {}
      if (typeof rule !== 'function') return
      this.table.validateCell(this.rowIndex, field || prop, rule)
    },
    handleWindowKeyup(e) {
      if (!this.show || this.table.editStop || !this.inTable(e.target)) return
      const keysStr = getKeysStr(e)
      const placements = { top: 'arrowup', right: 'enter', bottom: 'arrowdown', left: 'enter,shift' }

      // 解决回车选中值和回车跳下一个的冲突问题
      setTimeout(() => {
        for (const placement in placements) {
          const str = placements[placement]
          if (keysStr === str) {
            e.preventDefault()
            this.placement = placement
            this.handleValidate()
            this.to()
            break
          }
        }
      }, 50)
    },
    wrapperScroll(e) {
      if (!this.show) return
      const { scrollLeft, scrollTop } = e.target
      this.scroll = { ...{ scrollLeft, scrollTop }}
      // 滚动时取消编辑状态
      this.scrollTimer = setTimeout(() => {
        this.show = false
      }, 100)
    },
    to() {
      this.handleType = 'to'
      const { placement = 'right' } = this
      // 处理 stop 字段
      if (this.stop()) return

      if (['left', 'right'].indexOf(placement) > -1) {
        this.toX(placement)
      } else {
        this.toY(placement)
      }
    },
    canFocus(column, cell) {
      return column && !column.fixed && column.type !== 'selection' && cell && !cell.classList.contains('is-hidden')
    },
    toX() {
      const { placement } = this
      let cellIndex = 0
      let columns = []
      let column = {}
      const filterColumns = columns => columns.filter(d => {
        const { prop, fixed } = d
        return prop && !fixed && !this.skip(d)
      })
      if (placement === 'right') {
        cellIndex = this.cellIndex + 1
        columns = filterColumns(this.columns.slice(cellIndex, this.columns.length - 1))
        column = columns[0] || false
      } else {
        cellIndex = this.cellIndex
        columns = filterColumns(this.columns.slice(0, cellIndex))
        column = columns[columns.length - 1] || false
      }
      const { cell } = this.getColumn(column.prop)

      if (column && this.canFocus(column, cell)) {
        this.editCell(column, cell)
      } else {
        shake(this.$el, 'x')
        this.$emit('columnLast', placement)
      }
    },
    toY() {
      const { placement, column } = this
      const cell = getTableNode(this.cell, placement)
      if (cell) {
        this.editCell(column, cell)
      } else {
        shake(this.$el, 'y')
        this.$emit('rowLast', placement)
      }
    },
    stop() {
      const { edit: { stop } = {}} = this.column || {}
      if (stop === undefined) return false

      if (typeof stop === 'function') {
        return stop(this.rowIndex)
      }
      if (typeof stop !== 'boolean') {
        console.error(`${this.column.prop} 字段，stop类型必须是 function/boolean`)
      }
      return stop || false
    },
    skip(column) {
      const { edit: { skip } = {}} = column || {}
      if (skip === undefined) return false

      if (typeof skip === 'function') {
        return skip(this.rowIndex)
      }
      if (typeof skip !== 'boolean') {
        console.error(`${this.column.prop} 字段，skip类型必须是 function/boolean`)
      }
      return skip
    },

    handleEditCell(row, column, cell) {
      this.handleType = 'click'
      const { prop } = column
      prop && this.editCell(this.columns.find(d => d.prop === prop), cell)
    },
    editCell(column, cell) {
      const { prop } = column || {}
      const cellIndex = this.getColIndex(prop)
      // console.log({ column, cell, cellIndex })
      if (cellIndex === -1 || !this.canFocus(column, cell)) return
      this.column = column
      this.cellIndex = cellIndex
      this.cell = cell
      this.show = true
      const colid = cell.getAttribute('data-colid')
      const [rowIndex] = colid.split('-')
      this.rowIndex = (+rowIndex) - 1

      this.$nextTick(() => {
        const overflows = this.fixOverflow() // 处理溢出
        if (overflows) {
          const unWatchScroll = this.$watch('scroll', () => {
            clearTimeout(this.scrollTimer)
            unWatchScroll && unWatchScroll()
          })
        }
        setTimeout(() => {
          this.setElPos() // 设置编辑框位置

          this.handleFocus() // 处理聚焦
        }, 0)
      })
    },
    fixOverflow() {
      const { cell, wrapper } = this
      const { leftWidth, rightWidth } = this.table
      const overflow = isOverflow(cell, wrapper, { leftWidth, rightWidth })
      const { width: wrapperWidth, height: wrapperHeight } = wrapper.getBoundingClientRect()
      !this.oldCell && (this.oldCell = wrapper.querySelector('.eff-table__body-row').childNodes[0])
      const keys = []
      for (const key in overflow) {
        if (overflow[key]) {
          const { left, top, right, bottom } = cell.getBoundingClientRect()
          const { left: oldLeft, top: oldTop, right: oldRight, bottom: oldBottom } = this.oldCell.getBoundingClientRect() || {}
          if (key === 'left') {
            const offset = this.handleType === 'to' ? oldLeft - right : 0 // 偏移量，用户点击时不计算
            wrapper.scrollLeft = wrapper.scrollLeft - wrapperWidth / 2 - offset
          } else if (key === 'right') {
            const offset = this.handleType === 'to' ? left - oldRight : 0
            wrapper.scrollLeft = wrapper.scrollLeft + wrapperWidth / 2 + offset
          } else if (key === 'top') {
            const offset = this.handleType === 'to' ? oldTop - bottom : 0
            wrapper.scrollTop = wrapper.scrollTop - wrapperHeight / 2 - offset
          } else if (key === 'bottom') {
            const offset = this.handleType === 'to' ? top - oldBottom : 0
            wrapper.scrollTop = wrapper.scrollTop + wrapperHeight / 2 + offset
          }
          keys.push(key)
        }
      }
      return keys.length ? keys : false
    },
    handleFocus() {
      setTimeout(() => {
        const { editRender, editRender: { componentInstance } = {}} = this
        // 原生input
        if (editRender && editRender.tag === 'input') {
          const { elm } = editRender
          elm.focus && elm.focus()
          elm.select && elm.select()
          return
        }

        // 非编辑组件聚焦到隐藏元素，
        const input = this.$refs.editInput
        const inputFocus = () => {
          input && input.focus()
        }
        if (!editRender || !componentInstance) {
          inputFocus()
          return
        }
        const component = componentInstance.getFocusComponent ? componentInstance.getFocusComponent() : componentInstance
        this.component = component

        // 处理禁用
        if (componentInstance.disabled || component.disabled) {
          inputFocus()
          if (this.handleType === 'to') {
            ['left', 'right'].indexOf(this.placement) > -1 && this.to()
          }
          return
        }

        const target = component.getInput ? component.getInput() : component
        component.focus ? component.focus() : target.focus()
        componentInstance.$emit('focus')
        this.table.$emit('focus', this.column.prop, this.rowIndex)
        target.select && target.select()
      }, 50)
    },
    setElPos() {
      const { left, top, width, height } = this.cell.getBoundingClientRect()
      this.$el.style.left = `${left - 1}px`
      this.$el.style.top = `${top - 1}px`
      this.$el.style.width = `${width + 1}px`
      this.$el.style.height = `${height}px`
    },
    handleWindowMousedown(e) {
      if (!this.show || this.$el.contains(e.target) || this.table.editStop) return
      this.show = false
    },
    close() {
      this.show = false
    },
    focus(rowIndex, prop) {
      const { column, cell, colIndex } = this.getColumn(prop, rowIndex)
      this.handleType = 'to'
      this.editCell(column, cell, colIndex)
    },
    getRow(rowIndex, colIndex) {
      const rowid = rowIndex + 1
      const colid = colIndex + 1
      return this.body.querySelector(`.eff-table__body-row[data-rowid='${rowIndex + 1}'] .eff-table__column[data-colid='${rowid}-${colid}']`)
    },
    getColumn(prop, rowIndex = this.rowIndex) {
      const colIndex = this.getColIndex(prop)
      const cell = this.getRow(rowIndex, colIndex)
      const column = this.columns[colIndex]
      return { column, cell, colIndex }
    },
    getColIndex(prop) {
      const index = this.columns.findIndex(d => d.prop && d.prop === prop)
      return index > -1 ? index : this.columns.findIndex(d => d.prop)
    },
    inTable(target) {
      return target.nodeName === 'BODY' || this.table.$el.contains(target)
    }
  },
  render(h) {
    const classes = `eff-table-edit${this.show ? ' is-show' : ' is-hide'}`
    const style = { '--height': this.table.rowHeight - 2 + 'px' }
    const input = this.$createElement('input', { class: 'eff-table-edit-input', ref: 'editInput' })
    return h('div', { class: classes, style }, [this.editRender, input])
  }
}
