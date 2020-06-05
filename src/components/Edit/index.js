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
      wrapper: null,
      suggestionVisible: false,
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
    component(val) {
      this.unwatch && this.unwatch()
      if (val) {
        // 下拉选项打开时暂停处理
        this.unwatch = val.$watch('suggestionVisible', val => {
          this.suggestionVisible = val
        })
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
      if (!this.show || this.suggestionVisible || !this.inTable(e.target)) return
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
      const cell = getTableNode(this.cell, placement)
      const cellIndex = placement === 'right' ? this.cellIndex + 1 : this.cellIndex - 1
      const column = this.columns[cellIndex]
      if (this.canFocus(column, cell, cellIndex)) {
        this.editCell(column, cell, cellIndex)
      } else {
        shake(this.$el, 'x')
        this.$emit('columnLast', placement)
      }
    },
    toY() {
      const { placement, column } = this
      const cell = getTableNode(this.cell, placement)
      if (cell) {
        const { prop } = column || {}
        this.editCell(column, cell, this.getCellIndex(prop))
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
    skip() {
      const { edit: { skip } = {}} = this.column || {}
      if (skip === undefined) return false

      if (typeof skip === 'function') {
        return skip(this.rowIndex) && this.to()
      }
      if (typeof skip !== 'boolean') {
        console.error(`${this.column.prop} 字段，skip类型必须是 function/boolean`)
      }
      return skip && this.to()
    },

    handleEditCell(row, column, cell) {
      this.handleType = 'click'
      const { prop } = column
      prop && this.editCell(this.columns.find(d => d.prop === prop), cell, this.getCellIndex(prop))
    },
    editCell(column, cell, cellIndex) {
      // console.log({ column, cell, cellIndex })
      if (cellIndex === -1 || !this.canFocus(column, cell)) return
      this.column = this.columns[cellIndex]
      this.cell = cell
      this.cellIndex = cellIndex
      this.rowIndex = [...this.table.$el.querySelector('.eff-table__body').childNodes].findIndex(d => d.contains(cell))
      this.show = true
      // 处理 skip 字段
      if (this.handleType === 'to' && this.skip()) return

      this.$nextTick(() => {
        const overflows = this.fixOverflow() // 处理溢出
        if (overflows) {
          const unWatchScroll = this.$watch('scroll', () => {
            clearTimeout(this.scrollTimer)
            unWatchScroll && unWatchScroll()
          })
        }
        this.setElPos() // 设置编辑框位置

        this.handleFocus() // 处理聚焦
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
      if (!this.show || this.$el.contains(e.target) || this.suggestionVisible) return
      this.show = false
    },
    close() {
      this.show = false
    },
    focus(rowIndex, prop) {
      const cellIndex = this.getCellIndex(prop)
      const cell = this.table.tableBody.childNodes[rowIndex].childNodes[cellIndex]
      const column = this.columns[cellIndex]
      this.handleType = 'to'
      this.editCell(column, cell, cellIndex)
    },
    getCellIndex(prop) {
      const index = this.columns.findIndex(d => d.prop && d.prop === prop)
      return index > -1 ? index : this.columns.findIndex(d => d.prop)
    },
    inTable(target) {
      return target.nodeName === 'BODY' || this.table.$el.contains(target)
    }
  },
  render(h) {
    const classes = `table-edit${this.show ? ' is-show' : ' is-hide'}`
    const style = { '--height': this.table.rowHeight - 2 + 'px' }
    const input = this.$createElement('input', { attrs: { class: 'editInput' }, ref: 'editInput' })
    return h('div', { class: classes, style }, [this.editRender, input])
  }
}
