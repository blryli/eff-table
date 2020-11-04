import { getKeysStr, getType } from 'utils'
import { on, off } from 'utils/dom'
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
      placement: '',
      component: null,
      handleType: null,
      scrollNum: 0
    }
  },
  inject: ['table'],
  computed: {
    editRender() {
      const { rowIndex, table, column = {}, $createElement } = this
      const { edit: { render } = {}, prop } = column || {}
      return render && typeof render === 'function' && render($createElement, { row: table.data[rowIndex], rowIndex, column, columnIndex: this.getColumnIndex(column.prop), prop }) || ''
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.table.$emit('editOpen')
      } else {
        this.component && this.component.close && this.component.close()
        this.handleValidate()
        this.table.clearSelection()
        this.placement = ''
        this.scrollNum = 0
        this.column = null
        this.cell = null
        this.table.$emit('editClose')
        this.table.$emit('blur')
      }
    },
    'table.scrollTop'(scrollTop) {
      this.wrapperScroll(scrollTop)
    },
    'table.scrollLeft'(scrollLeft) {
      this.wrapperScroll(scrollLeft)
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
    })
  },
  beforeDestroy() {
    off(window, 'mousedown', this.handleWindowMousedown)
    off(window, 'keyup', this.handleWindowKeyup)
    off(window, 'resize', this.handleWindowResize)
    off(document.getElementById('app-container'), 'scroll', this.close)
    this.table.$off('cell-click', this.handleEditCell)
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

            // 跳下一个处理
            const { column } = this
            const { prop, edit: { leaveTime } = {}} = column
            const { rowIndex, table } = this
            const row = table.tableData[rowIndex]
            if (leaveTime) {
              if (typeof leaveTime === 'number') {
                setTimeout(() => {
                  this.to()
                }, leaveTime)
              } else if (typeof leaveTime === 'function') {
                const leaveFn = leaveTime({ row, rowIndex })
                if (getType(leaveFn) === 'Promise') {
                  leaveFn.then(() => {
                    this.to()
                  })
                } else {
                  console.error(`[${prop}] leaveTime 函数返回值必须是promise`)
                }
              } else {
                console.error(`[${prop}] leaveTime 参数类型必须是数字或函数`)
              }
            } else {
              this.to()
            }
            break
          }
        }
      }, 50)
    },
    wrapperScroll(scroll) {
      this.scroll = scroll
      if (!this.show) return
      // 滚动时取消编辑状态
      this.scrollNum = this.scrollNum + 1
      if (this.scrollNum > 2) this.show = false
    },
    to() {
      this.handleType = 'to'
      const { placement = 'right' } = this

      if (['left', 'right'].indexOf(placement) > -1) {
        this.toX(placement)
      } else {
        this.toY(placement)
      }
    },
    canFocus(column, cell) {
      const { type, edit: { render } = {}} = column
      const types = ['selection', 'index']
      return column && render && typeof render === 'function' && types.indexOf(type) === -1 && (!cell || cell && !cell.classList.contains('is-hidden'))
    },
    toX() {
      const { placement, rowIndex } = this
      let cellIndex = 0
      let columns = []
      let column = {}
      const filterColumns = columns => columns.filter(column => this.canFocus(column) && !this.skip(column))
      if (placement === 'right') {
        cellIndex = this.cellIndex + 1
        columns = filterColumns(this.columns.slice(cellIndex))
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
        this.table.$emit('editColumnLastToNext', { placement, rowIndex, cellIndex: this.cellIndex })
      }
    },
    toY() {
      const { placement, column } = this
      const cell = getTableNode(this.cell, placement)
      if (cell) {
        const colid = cell.getAttribute('data-colid')
        const [rowIndex] = colid.split('-')
        this.rowIndex = +rowIndex - 1
        this.editCell(column, cell)
      } else {
        shake(this.$el, 'y')
      }
    },
    skip(column) {
      const { edit: { skip } = {}} = column || {}
      if (skip === undefined) return false

      if (typeof skip === 'function') {
        return skip({ row: this.table.data[this.rowIndex], rowIndex: this.rowIndex })
      }
      if (typeof skip !== 'boolean') {
        console.error(`${this.column.prop} 字段，skip类型必须是 function/boolean`)
      }
      return skip || false
    },

    handleEditCell({ column, cell, rowIndex }) {
      this.handleType = 'click'
      this.rowIndex = rowIndex
      this.editCell(column, cell)
    },
    editCell(column, cell) {
      this.scrollNum = 0
      const { prop } = column || {}
      const cellIndex = this.getColumnIndex(prop)
      const editCell = (cell) => {
        // console.log({ column, cell, cellIndex, index: this.cellIndex })
        if (cellIndex === -1 || !this.canFocus(column, cell)) return

        // 处理溢出
        this.fixOverflow(cell, cellIndex).then(() => {
          this.column = column
          this.cellIndex = cellIndex
          this.cell = this.getColumn(prop).cell
          this.show = true
          this.setElPos() // 设置编辑框位置

          this.table.$emit('blur', prop, this.rowIndex)
          this.handleFocus()// 处理聚焦
        })
      }
      if (!cell) {
        this.fixOverflowX(cellIndex).then(() => {
          const { cell: getCell } = this.getColumn(prop)
          editCell(cell || getCell)
        })
      } else {
        editCell(cell)
      }
    },
    fixOverflowX(cellIndex) {
      const { columnWidths, bodyWrapperWidth } = this.table
      const scrollLeft = columnWidths.slice(0, cellIndex).reduce((acc, cur) => acc + cur, 0) - bodyWrapperWidth / 2
      this.table.scrollLeft = scrollLeft
      return this.$nextTick()
    },
    fixOverflow(cell, cellIndex) {
      const { wrapper } = this
      const { bodyWrapperWidth, rowHeight, leftWidth, rightWidth } = this.table
      const overflow = isOverflow(cell, wrapper, { leftWidth, rightWidth })
      const { height: wrapperHeight } = wrapper.getBoundingClientRect()
      const colid = cell.getAttribute('data-colid')
      const [rowIndex] = colid.split('-')
      let isOver = false
      for (const key in overflow) {
        if (overflow[key]) {
          const scrollLeft = this.table.columnWidths.slice(0, cellIndex).reduce((acc, cur) => acc + cur, 0)
          if (key === 'left' || key === 'right') {
            this.table.scrollLeft = scrollLeft - bodyWrapperWidth / 2
          } else if (key === 'top' || key === 'bottom') {
            this.table.scrollTop = rowIndex * rowHeight - wrapperHeight / 2
          }
          isOver = true
        }
      }
      return this.$nextTick().then(() => isOver)
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
      this.$el.style.height = `${height + 1}px`
    },
    handleWindowMousedown(e) {
      if (!this.show || this.$el.contains(e.target) || this.table.editStop) return
      this.show = false
    },
    close() {
      this.show = false
    },
    focus(rowIndex, prop = this.columns.find(d => d.prop).prop) {
      this.rowIndex = +rowIndex
      const { column, cell, columnIndex } = this.getColumn(prop, +rowIndex)
      if (cell) {
        this.editCell(column, cell)
      } else {
        this.fixOverflowX(columnIndex).then(() => {
          this.table.toScroll(+rowIndex).then(() => {
            setTimeout(() => {
              const { column, cell } = this.getColumn(prop, +rowIndex)
              this.handleType = 'to'
              this.editCell(column, cell)
            }, 100)
          })
        })
      }
    },
    getRow(rowIndex, columnIndex) {
      const rowid = rowIndex + 1
      const colid = columnIndex + 1
      return this.body.querySelector(`.eff-table__body-row[data-rowid='${rowIndex + 1}'] .eff-table__column[data-colid='${rowid}-${colid}']`)
    },
    getColumn(prop, rowIndex) {
      if (rowIndex === undefined) rowIndex = this.rowIndex
      const columnIndex = this.getColumnIndex(prop)
      const cell = this.getRow(rowIndex, columnIndex)
      const column = this.columns[columnIndex]
      return { column, cell, columnIndex }
    },
    getColumnIndex(prop) {
      const { bodyColumns } = this.table
      const index = bodyColumns.findIndex(d => d.prop && d.prop === prop)
      return index > -1 ? index : bodyColumns.findIndex(d => d.prop)
    },
    inTable(target) {
      return target.nodeName === 'BODY' || this.table.$el.contains(target)
    }
  },
  render(h) {
    const classes = `eff-table-edit${this.show ? ' is-show' : ' is-hide'}`
    const style = { '--height': this.table.rowHeight - 2 + 'px' }
    const input = this.$createElement('input', { class: 'eff-table-edit-input', ref: 'editInput' })
    return <div class={classes} style={style}>{[this.editRender, input]}</div>
  }
}
