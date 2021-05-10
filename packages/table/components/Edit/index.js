import { getType } from 'pk/utils'
import { on, off } from 'pk/utils/dom'
import { renderer } from 'pk/utils/render'
import { isOverflow, shake } from './dom'

export default {
  name: 'TableEdit',
  props: {
    columns: { type: Array, default: () => [] }
  },
  data() {
    return {
      show: false,
      column: null,
      rowIndex: 0,
      cell: null,
      placement: '',
      component: null,
      componentValue: null,
      handleType: null,
      scrollNum: 0,
      dialogVisible: true,
      baseText: null,
      columnIndex: null
    }
  },
  inject: ['table'],
  computed: {
    row() {
      const { table, rowIndex } = this
      const { proxyConfig } = table
      return (proxyConfig ? table.tableData : table.data)[rowIndex]
    },
    editRender() {
      const { row, column } = this
      if (!column) return ''
      const { edit, prop, config } = column || {}
      if (edit) {
        const { rowIndex, table, $createElement } = this

        const columnIndex = this.getColumnIndex(column.prop)
        const { render } = edit || {}

        if (this.baseText === null || this.columnIndex !== columnIndex) {
          this.baseText = row && row[prop] || null
          this.columnIndex = columnIndex
        }

        if (typeof render === 'function') {
          return render($createElement, { row, rowIndex, column, columnIndex, prop }) || ''
        } else {
          const renderOpts = Object.assign({ name: 'input' }, config, render)
          const { name } = renderOpts
          const compConf = renderer.get(name)
          return compConf && compConf.renderEdit($createElement, renderOpts, { vue: table, data: row, row, rowIndex, column, columnIndex, prop, edit: this }) || ''
        }
      }
    }
  },
  watch: {
    component() {
      this.dialogVisible = true
    },
    rowIndex() {
      this.dialogVisible = true
    },
    show(val) {
      const { table } = this
      if (val) {
        table.$emit('edit-open')
      } else {
        this.blurEvent().then(() => {
          this.placement = ''
          this.scrollNum = 0
          this.column = null
          this.cell = null
          this.visible = true
          table.$emit('edit-close')
        })
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
    on(window, 'resize', this.close)
    on(document.getElementById('app-container'), 'scroll', this.close)
    this.$nextTick(() => {
      this.wrapper = this.table.$el.querySelector('.eff-table__body-wrapper')
      this.body = this.wrapper.querySelector('.eff-table__body')
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.handleWindowResize)
    off(document.getElementById('app-container'), 'scroll', this.close)
  },
  methods: {
    handleValidate() {
      const { prop, rules = [] } = this.column || {}
      if (!rules.length || !this.row) return this.$nextTick()
      return this.table.validateFiled(this.row, prop, rules)
    },
    updateStatus() {
      const { table, column, row } = this
      column && column.prop && row && table.updateStatus(row, column.prop)
    },
    handleWindowMousedown(e) {
      const { show, $el, table } = this
      if (!show || $el.contains(e.target) || table.editIsStop) return
      this.show = false
    },

    handleWindowKeyup(e, keysStr) {
      const { show, table, row, inTable } = this
      if (!show || table.editIsStop || !inTable(e.target)) return
      e.stopPropagation()
      e.preventDefault()
      const placements = { top: 'arrowup', right: 'enter', bottom: 'arrowdown', left: 'enter,shift' }

      if (keysStr === 'escape') {
        row[this.column.prop] = this.baseText
        return this.close()
      }

      // 解决回车选中值和回车跳下一个的冲突问题
      setTimeout(() => {
        for (const placement in placements) {
          const str = placements[placement]
          if (keysStr === str) {
            e.preventDefault()
            this.placement = placement

            // 跳下一个处理
            const { row, rowIndex, column } = this
            const { prop, edit: { leaveTime } = {}} = column
            if (leaveTime) {
              if (typeof leaveTime === 'number') {
                setTimeout(() => {
                  this.to()
                }, leaveTime)
              } else if (typeof leaveTime === 'function') {
                const leaveFn = leaveTime({ prop, row, rowIndex })
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
      const { placement = 'right', table, column: { prop }} = this
      const { editLengthways } = table

      if (['left', 'right'].indexOf(placement) > -1) {
        this.toX()
      } else {
        editLengthways && this.toY(prop)
      }
    },
    canFocus(column, cell) {
      const { type, edit } = column
      const types = ['selection', 'index']
      return edit && column && types.indexOf(type) === -1 && (!cell || cell && !cell.classList.contains('is-hidden'))
    },
    toX() {
      const { placement, columns, cellIndex, table, $el, canFocus, skip, getColumn, editCell } = this
      let toCellIndex = 0
      let toColumns = []
      let column = {}
      const filterColumns = columns => columns.filter(column => canFocus(column) && !skip(column))
      if (placement === 'right') {
        toCellIndex = cellIndex + 1
        toColumns = filterColumns(columns.slice(toCellIndex))
        column = toColumns[0] || false
      } else {
        toCellIndex = cellIndex
        toColumns = filterColumns(columns.slice(0, toCellIndex))
        column = toColumns[toColumns.length - 1] || false
      }
      const { cell } = getColumn(column.prop)

      if (column && canFocus(column, cell)) {
        // 当前行有可聚焦元素
        this.blurEvent().then(() => editCell(column, cell))
      } else {
        // 当前行没有可聚焦元素，进行跨行编辑
        table.editLoop ? this.toY() : shake($el, 'x')
      }
    },
    // 跳过pending状态的行
    getSkipNum(startIndex, endIndex) {
      const { table } = this
      const { editStore: { pendingList }, rowId, tableData } = table
      const byData = tableData.slice(startIndex, endIndex)
      if (startIndex === 0) byData.reverse()
      const pendingIds = pendingList.map(d => d[rowId])
      if (pendingList.length) {
        const index = byData.findIndex(da => !pendingIds.includes(da[rowId]))
        return index === -1 ? -1 : index + 1
      }
      return 1
    },
    toY(prop) {
      const { table, placement, rowIndex, $el } = this
      if (['right', 'bottom'].includes(placement)) {
        const skipNum = this.getSkipNum(rowIndex + 1, rowIndex + 10)
        skipNum > -1 && rowIndex + skipNum < table.tableData.length ? this.focus(rowIndex + skipNum, prop) : shake($el, 'y')
      } else {
        const skipNum = this.getSkipNum(0, rowIndex)
        skipNum > -1 && rowIndex - skipNum >= 0 ? this.focus(rowIndex - skipNum, prop) : shake($el, 'y')
      }
    },
    skip(column) {
      const { edit: { skip } = {}, prop = '' } = column || {}
      const { row, rowIndex } = this
      if (skip === undefined) return false

      if (typeof skip === 'function') {
        return skip({ row, rowIndex })
      }
      if (typeof skip !== 'boolean') {
        console.error(`${prop} 字段，skip类型必须是 function/boolean`)
      }
      return skip || false
    },

    handleEditCell({ column, cell, rowIndex }) {
      this.handleType = 'click'
      this.blurEvent().then(() => {
        this.rowIndex = rowIndex
        this.editCell(column, cell)
      })
    },
    editCell(column, cell) {
      this.scrollNum = 0
      const { prop } = column || {}
      const { rowIndex, getColumnIndex, canFocus, getColumn, fixOverflowX } = this
      const cellIndex = getColumnIndex(prop)
      const editCell = (cell) => {
        if (cellIndex === -1 || !canFocus(column, cell)) return
        // 处理溢出
        this.fixOverflow(cell, cellIndex).then(() => {
          this.column = column
          this.cellIndex = cellIndex
          this.cell = getColumn(prop).cell
          this.show = true
          this.setElPos() // 设置编辑框位置

          this.table.$emit('blur', prop, rowIndex)
          this.handleFocus()// 处理聚焦
        })
      }
      if (!cell) {
        fixOverflowX(cellIndex).then(() => {
          const { cell: getCell } = getColumn(prop)
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
      const { bodyWrapperWidth, rowHeight, leftWidth, rightWidth, overflowX, overflowY } = this.table
      const overflow = isOverflow({ cell, wrapper, leftWidth, rightWidth, overflowX, overflowY })
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
        this.componentValue = component.value

        // 处理禁用
        if (componentInstance.disabled || component.disabled) {
          inputFocus()
          if (this.handleType === 'to') {
            ['left', 'right'].indexOf(this.placement) > -1 && this.to()
          }
          return
        }

        const target = component.getInput ? component.getInput() : component
        if (component.focus || target.focus) {
          component.focus ? component.focus() : target.focus()
          componentInstance.$emit('focus')
          this.table.$emit('focus', this.column.prop, this.rowIndex)
        }
        target && target.select && target.select()
      }, 50)
    },
    setElPos() {
      const { left, top, width, height } = this.cell.getBoundingClientRect()
      const { left: tLeft, top: tTop } = this.table.$el.getBoundingClientRect()
      this.$el.style.left = `${left - tLeft - 1}px`
      this.$el.style.top = `${top - tTop - 1}px`
      this.$el.style.width = `${width + 1}px`
      this.$el.style.height = `${height + 1}px`
    },
    close() {
      this.show = false
      this.baseText = null
    },
    blurEvent() {
      const { component, table, rowIndex, columnIndex, column } = this
      const { tableData } = this.table
      if (component) {
        return this.handleValidate().then(res => {
          if (column && column.prop) {
            const data = { rowIndex, columnIndex, newData: tableData[rowIndex][column.prop], oldData: this.baseText }
            if (data.oldData !== null && data.oldData !== data.newData) {
              this.table.$emit('table-update-data', data)
            }
          }
          this.updateStatus()
          const { close } = component
          component.$emit('blur')
          close && close()
          table.$emit('blur')
          return this.$nextTick()
        })
      }
      return this.$nextTick()
    },
    focus(rowIndex, prop = (this.table.visibleColumns.find(d => d.prop && d.edit) || {}).prop) {
      if (!prop) return
      const { table, getColumn, editCell, fixOverflowX } = this
      rowIndex = Number(rowIndex)
      const lastIndex = table.tableData.length - 1
      this.rowIndex = rowIndex < 0 ? 0 : rowIndex > lastIndex ? lastIndex : rowIndex
      const { column, cell, columnIndex } = getColumn(prop, rowIndex)
      this.column = column
      if (cell) {
        setTimeout(() => this.blurEvent().then(() => editCell(column, cell)))
      } else {
        fixOverflowX(columnIndex).then(() => {
          table.toScroll(rowIndex).then(() => {
            setTimeout(() => {
              const { column, cell } = getColumn(prop, rowIndex)
              this.column = column
              this.handleType = 'to'
              this.blurEvent().then(() => editCell(column, cell))
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
      const { rowIndex: index, columns, getColumnIndex, getRow } = this
      if (rowIndex === undefined) rowIndex = index
      const columnIndex = getColumnIndex(prop)
      const cell = getRow(rowIndex, columnIndex)
      const column = columns[columnIndex]
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
    const { show, table, editRender } = this
    const classes = `eff-table-edit${show ? ' is-show' : ' is-hide'}`
    const style = { '--height': table.rowHeight - 2 + 'px' }
    const input = h('input', { class: 'eff-table-edit-input', ref: 'editInput' })
    return <div class={classes} style={style}>{[editRender, input]}</div>
  }
}
