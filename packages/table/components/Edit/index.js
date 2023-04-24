import { columnIsEdit, isVNode } from 'pk/utils'
import { on, off } from 'pk/utils/dom'
import { renderer } from 'pk/utils/render'
import { isOverflow, shake } from './dom'
import XEUtils from 'xe-utils'

let globalBaseText
let globalColumnIndex
export default {
  name: 'TableEdit',
  props: {
    columns: { type: Array, default: () => [] }
  },
  data() {
    return {
      show: false,
      row: null,
      rowid: null,
      column: null,
      rowIndex: null,
      cell: null,
      placement: '',
      component: null,
      componentValue: null,
      handleType: null,
      scrollNum: 0,
      dialogVisible: true,
      baseText: null,
      columnIndex: null,
      message: ''
    }
  },
  inject: ['table', 'root'],
  computed: {
    editRender() {
      const { row, column } = this
      if (!row || !column) return ''
      const { edit, prop, config = {}} = column || {}
      if (columnIsEdit(column)) {
        const { rowIndex, table, $createElement } = this
        const { tableSourceData, tableTreeConfig, rowId } = table
        const { children } = tableTreeConfig || {}
        const rowid = row[rowId]
        const { item: sourceRow } = XEUtils.findTree(tableSourceData, item => item[rowId] === rowid, children) || {}

        const columnIndex = this.getColumnIndex(column.prop)
        const { render } = edit || {}

        // debugger

        if (globalBaseText === null || globalColumnIndex !== columnIndex) {
          globalBaseText = row && row[prop] || null
          this.columnIndex = columnIndex
          globalColumnIndex = columnIndex
        }
        const renderEdit = (render = {}) => {
          const renderOpts = XEUtils.merge({ name: 'input' }, config, render)
          const params = { root: table, table, vue: this, data: row, row, rowid, sourceRow, rowIndex, column, columnIndex, prop: render.prop || prop, edit: this }
          if (!renderOpts.name) renderOpts.name = 'input'
          // props支持函数
          const { props } = renderOpts
          if (props && typeof props === 'function') {
            renderOpts.props = props(params)
          }
          const compConf = renderer.get(renderOpts.name)
          return compConf && compConf.renderEdit && compConf.renderEdit($createElement, renderOpts, params) || ''
        }

        if (typeof render === 'function') {
          const renderFunc = render($createElement, { row, rowid, sourceRow, rowIndex, column, columnIndex, prop })
          // VNode线上会渲染成pe对象
          return isVNode(renderFunc) ? (renderFunc || '') : renderEdit(renderFunc)
        } else {
          return renderEdit(render)
        }
      }
    },
    hasTree() {
      return this.table.treeNum
    }
  },
  watch: {
    'table.tableData.length'() {
      this.rowIndex = null
    },
    component() {
      this.dialogVisible = true
    },
    rowIndex(rowIndex) {
      if (rowIndex === null) {
        this.row = null
        this.table.editStore.editRow = {}
      } else {
        this.table.editStore.editRow = this.row
        if (!this.hasTree) {
          this.row = this.table.afterData[rowIndex]
        }
      }
      this.dialogVisible = true
    },
    message() {
      this.table.$refs.popovers.validingTipClose()
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
    this.$nextTick(() => {
      this.wrapper = this.table.$el.querySelector('.eff-table__body-wrapper')
      if (this.wrapper) {
        this.body = this.wrapper.querySelector('.eff-table__body')
      }
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.close)
    this.wrapper = null
    this.body = null
    const { editRender, component, validateShowpopover } = this
    // 原生input
    if (editRender && editRender.tag === 'input') {
      off(editRender.elm, 'input', validateShowpopover)
    }
    if (component) {
      // 实时校验
      component.$off('input', validateShowpopover)
    }
    this.wrapper = null
    this.body = null
  },
  methods: {
    handleValidate() {
      const { column } = this
      const { prop, rules = [] } = column || {}
      if (!rules.length || !this.row) return this.$nextTick().then(() => false)
      return this.table.validateField(prop, rules, this.row)
    },
    validateShowpopover() {
      const { table, cell } = this
      this.handleValidate().then(res => {
        if (!res) return
        this.message = res.message
        setTimeout(() => {
          res.message && table.$refs.popovers.validingTipShow({ reference: cell, showAllways: true, effect: 'error', message: res.message })
        }, 20)
      })
    },
    fieldChange(value) {
      const { table, row, rowIndex, column, columnIndex } = this
      table.$emit('field-change', { row, rowIndex, column, columnIndex, value })
      table.dataChange()
      this.validateShowpopover()
    },
    updateStatus() {
      const { table, column, row } = this
      column && column.prop && row && table.updateStatus(row, column.prop)
    },
    handleWindowMousedown(e) {
      const { show, $el, table } = this
      if (!show || $el.contains(e.target) || table.tableEditConfig.editStop) return
      this.show = false
    },

    handleWindowKeyup(e, keysStr) {
      const { show, table, row, inTable } = this
      if (!show || table.tableEditConfig.editStop || !inTable(e.target)) return
      e.stopPropagation()
      e.preventDefault()
      const placements = { top: 'arrowup', right: 'enter', bottom: 'arrowdown', left: 'enter,shift' }

      if (keysStr === 'escape') {
        row[this.column.prop] = this.baseText
        return this.close()
      }

      // 解决回车选中值和回车跳下一个的冲突问题
      const timer = setTimeout(() => {
        for (const placement in placements) {
          const str = placements[placement]
          if (keysStr === str) {
            e.preventDefault()
            this.placement = placement

            // 跳下一个处理
            this.to()
            clearTimeout(timer)
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
      if (this.scrollNum > 3) this.show = false
    },
    to() {
      if (this.hasTree) return
      this.handleType = 'to'
      const { placement = 'right', column: { prop }} = this

      if (['left', 'right'].indexOf(placement) > -1) {
        this.toX()
      } else {
        this.toY(prop)
      }
    },
    canFocus(column, cell) {
      const { type } = column
      const types = ['selection', 'index']
      return columnIsEdit(column) && column && column.prop && !this.disabled(column) && types.indexOf(type) === -1 && (!cell || cell && !cell.classList.contains('is-hidden'))
    },
    toX(toPlacement) {
      if (toPlacement) this.placement = toPlacement
      const { placement, columns, cellIndex, table, $el, canFocus, getColumn, editCell } = this
      let toCellIndex = 0
      let toColumns = []
      let column = {}
      const filterColumns = columns => columns.filter(column => canFocus(column))
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
        table.tableEditConfig.editLoop ? this.toY() : shake($el, 'x')
      }
    },
    // 跳过pending状态的行
    getSkipPendingNum(startIndex, endIndex) {
      const { table } = this
      const { editStore: { pendingList }, rowId, afterData } = table
      const byData = afterData.slice(startIndex, endIndex)
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
        const skipNum = this.getSkipPendingNum(rowIndex + 1, rowIndex + 10)
        skipNum > -1 && rowIndex + skipNum < table.afterData.length ? this.focus(rowIndex + skipNum, prop) : shake($el, 'y')
      } else {
        const skipNum = this.getSkipPendingNum(0, rowIndex)
        skipNum > -1 && rowIndex - skipNum >= 0 ? this.focus(rowIndex - skipNum, prop) : shake($el, 'y')
      }
    },
    disabled(column) {
      const { rowId } = this.table
      const { edit = {}, config = {}} = column || {}
      const { disabled } = Object.assign({}, config, edit)
      const { row, rowIndex, columnIndex } = this
      if (!row || disabled === undefined) return false
      // console.log({ disabled })

      if (typeof disabled === 'function') {
        return Boolean(disabled({ row, rowid: row[rowId], rowIndex, column, columnIndex }))
      }
      return Boolean(disabled) || false
    },

    handleEditCell({ row, rowid, column, cell, rowIndex }) {
      this.handleType = 'click'
      if (!columnIsEdit(column)) {
        this.close()
        return
      }
      this.blurEvent().then(() => {
        this.row = row
        this.rowid = rowid
        this.rowIndex = rowIndex
        this.editCell(column, cell)
      })
    },
    editCell(column, cell) {
      this.scrollNum = 0
      const { prop } = column || {}
      const { getColumnIndex, canFocus, getColumn, fixOverflowX } = this
      const cellIndex = getColumnIndex(prop)
      const editCell = (cell) => {
        if (cellIndex === -1 || !canFocus(column, cell)) return
        // 处理溢出
        this.fixOverflow(cell, cellIndex).then(() => {
          this.column = column
          this.cellIndex = cellIndex
          this.cell = cell || getColumn(prop).cell
          this.show = true

          this.setElPos() // 设置编辑框位置

          this.handleFocus()// 处理聚焦d

          const { copy, $refs } = this.table
          if (copy) {
            $refs.selectRange.close()
          }
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
      const { widths: { columnWidths }, bodyWrapperWidth } = this.table
      this.table.scrollLeft = columnWidths.slice(0, cellIndex).reduce((acc, cur) => acc + cur, 0) - bodyWrapperWidth / 2
      return this.$nextTick()
    },
    fixOverflow(cell, cellIndex) {
      const { wrapper, table } = this
      const { bodyWrapperWidth, _rowHeight, widths: { leftWidth, rightWidth, columnWidths }, overflowX, overflowY, isScrollRightEnd } = table
      const overflow = isOverflow({ cell, wrapper, leftWidth, rightWidth, overflowX, overflowY })
      const { height: wrapperHeight } = wrapper.getBoundingClientRect()
      const colid = cell.getAttribute('data-colid')
      const [rowIndex] = colid.split('-')
      let isOver = false
      for (const key in overflow) {
        if (overflow[key]) {
          let scrollLeft = table.scrollLeft
          let scrollTop = table.scrollTop
          if ((key === 'left' && table.scrollLeft > 1) || (key === 'right' && !isScrollRightEnd)) {
            scrollLeft = columnWidths.slice(0, cellIndex).reduce((acc, cur) => acc + cur, 0) - bodyWrapperWidth / 2
          } else if (key === 'top' || key === 'bottom') {
            scrollTop = rowIndex * _rowHeight - wrapperHeight / 2
          }
          this.table.handleScroll(scrollLeft, scrollTop, '#')
          isOver = true
        }
      }
      return this.$nextTick().then(() => isOver)
    },
    handleFocus() {
      setTimeout(() => {
        const { table, row, rowIndex, column, columnIndex, cell, editRender, editRender: { componentInstance } = {}, validateShowpopover, fieldChange } = this
        // 原生input
        if (editRender && editRender.tag === 'input') {
          const { elm } = editRender
          on(elm, 'input', fieldChange)
          elm.focus && elm.focus()
          table.tableFocusToSelect && elm.select && elm.select()
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

        if (this.component) {
          // 实时校验
          this.component.$on('input', fieldChange)
        }
        validateShowpopover()

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

          this.table.$emit('focus', { prop: column.prop, row: this.row, rowIndex, columnIndex })
        }
        table.tableFocusToSelect && target && target.select && target.select()
        const { rowId } = table

        // 编辑时的校验提示
        if (row && column && cell) {
          const valid = table.validators.find(d => d.id === row[rowId] && d.prop === column.prop)
          if (valid) {
            table.$refs.popovers.validingTipShow({ reference: cell, showAllways: true, effect: 'error', message: valid.message })
          }
        }
      }, 50)
    },
    setElPos() {
      const { cell, table } = this
      if (cell) {
        const { left, top, width, height } = cell.getBoundingClientRect()
        const { left: tLeft, top: tTop } = table.$el.getBoundingClientRect()
        this.$el.style.left = `${left - tLeft - 1}px`
        this.$el.style.top = `${top - tTop - 1}px`
        this.$el.style.width = `${width + 1}px`
        this.$el.style.height = `${height + 1}px`
      }
    },
    close() {
      this.show = false
      this.baseText = null
    },
    blurEvent() {
      const { component, table, row, rowIndex, columnIndex, column, editRender, fieldChange } = this
      const { afterData } = this.table
      if (component) {
        column && column.prop && table.$emit('field.change', column.prop, rowIndex)
        if (column && column.prop && rowIndex !== null && afterData[rowIndex]) {
          const data = { rowIndex, columnIndex, newData: afterData[rowIndex][column.prop], oldData: globalBaseText }
          if (data.oldData !== null && data.oldData !== data.newData) {
            this.table.$emit('table-update-data', data)
          }
        }
        return this.handleValidate().then(() => {
          this.updateStatus()
          const { close } = component
          close && close()
          column && table.$emit('blur', { prop: column.prop, row, rowIndex, columnIndex })
          table.$refs.popovers.validingTipClose()
          // 原生input
          if (editRender && editRender.tag === 'input') {
            const { elm } = editRender
            off(elm, 'input', fieldChange)
          }
          if (this.component) {
            // 实时校验
            this.component.$off('input', fieldChange)
          }
          return this.$nextTick()
        })
      }
      return this.$nextTick()
    },
    focus(rowIndex, prop = (this.table.visibleColumns.find(d => this.canFocus(d)) || {}).prop) {
      if (!prop) return
      this.blurEvent().then(() => {
        const { table, getColumn, editCell, fixOverflowX } = this
        rowIndex = Number(rowIndex)
        const lastIndex = table.afterData.length - 1
        this.rowIndex = rowIndex < 0 ? 0 : rowIndex > lastIndex ? lastIndex : rowIndex
        const { column, cell, columnIndex } = getColumn(prop, rowIndex)
        this.column = column
        if (cell) {
          setTimeout(() => editCell(column, cell))
        } else {
          fixOverflowX(columnIndex).then(() => {
            table.toScroll(rowIndex).then(() => {
              setTimeout(() => {
                const { column, cell } = getColumn(prop, rowIndex)
                this.column = column
                this.handleType = 'to'
                editCell(column, cell)
              }, 100)
            })
          })
        }
      })
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
    const style = { '--height': table._rowHeight - 2 + 'px' }
    const input = h('input', { class: 'eff-table-edit-input', ref: 'editInput' })
    return <div class={classes} style={style}>{[editRender, input]}</div>
  }
}
