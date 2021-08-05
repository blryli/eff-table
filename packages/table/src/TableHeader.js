import TableHeaderColumn from './TableHeaderColumn'
import Search from '../components/Search'
import Contextmenu from 'pk/contextmenu'
import { on, off, hasClass, onMousemove, getCell } from 'pk/utils/dom'

export default {
  name: 'TableHeader',
  props: {
    visibleColumns: { type: Array, default: () => [] },
    bodyColumns: { type: Array, default: () => [] },
    fixed: { type: String, default: '' }
  },
  components: { TableHeaderColumn, Search, Contextmenu },
  data() {
    return {
      dragingTarget: null,
      height: 0,
      isDraging: false,
      isColumnsChange: false,
      searchData: [],
      contextmenuList: [
        { title: '前移一列', disabled: false, show: true },
        { title: '后移一列', disabled: false, show: true },
        { title: '移到首列', disabled: false, show: true },
        { title: '移到尾列', disabled: false, show: true },
        { title: '设为左固定列', disabled: false, show: true },
        { title: '设为右固定列', disabled: false, show: true },
        { title: '取消固定列', disabled: false, show: true },
        { title: '隐藏列', disabled: false, show: true }
      ]
    }
  },
  watch: {
    'table.tableForm'(val) {
      if (JSON.stringify(val) === '[]') this.searchData = []
    },
    'table.scrollLeft'(val) {
      if (this.fixed) return
      this.$el.scrollLeft = val
    },
    'table.tableColumns'() {
      // columns 变化之后重新渲染搜索组件
      this.isColumnsChange = true
      this.$nextTick(() => {
        this.isColumnsChange = false
      })
    }
  },
  computed: {
    dragStyle() {
      const { dragingTarget, table } = this
      const { top, left, width } = dragingTarget && dragingTarget.getBoundingClientRect() || {}
      return {
        display: dragingTarget ? 'block' : 'none',
        height: table.heights.headerHeight + 'px',
        top: top + 'px',
        left: left + width - 8 + 'px'
      }
    },
    checkedColumnGroup() {
      var result = []
      var i = 0
      const list = [...this.table.headerCheckedColumns].sort((a, b) => a.columnId - b.columnId)

      list.forEach((item, index) => {
        if (index === 0) {
          result[0] = [item.columnId]
        } else if (parseInt(item.columnId) - parseInt(list[index - 1].columnId) === 1) { // 判断当前值 和 前一个值是否相差1
          result[i].push(item.columnId)
        } else {
          result[++i] = [item.columnId] // 开辟新空间。
        }
      })

      return result.filter(d => d.length > 1)
    }
  },
  inject: ['table'],
  methods: {
    sortChange(sort) {
      this.$emit('sort-change', sort)
    },
    renderColumns(columns) {
      const { table, sortChange } = this
      const { rowHeight } = table
      let index = 0
      const render = (columns, colid = '', parentProp = []) => {
        return columns.reduce((acc, column, columnIndex) => {
          const { children = [] } = column
          const parent = colid ? `${colid}-${columnIndex + 1}` : `${columnIndex + 1}`
          if (parentProp.length) {
            column.parent = parentProp
          }
          column.columnId = parent
          if (children.length) {
            acc.push(<div class={['eff-table__header-group', table.headerCheckedColumns.some(d => d === column) ? 'is--checked' : '']} data-colid={parent}>
              <div class='eff-table__header-group-title' style={{ maxHeight: rowHeight + 'px', borderLeft: !column.parent && columnIndex === 0 ? 0 : '' }}>
                {column.title}
              </div>
              <div class='eff-table__header-group-children'>
                {
                  render(children, parent, parentProp.concat([column.columnId]))
                }
              </div>
            </div>)
          } else {
            acc.push(<TableHeaderColumn {...{
              attrs: {
                colid: parent,
                column,
                columnIndex,
                bodyColumnIndex: index
              },
              class: { 'is--checked': table.headerCheckedColumns.some(d => d === column) },
              on: {
                'sort-change': sortChange
              }
            }}
            />)
            index += 1
          }
          return acc
        }, [])
      }
      return render(columns)
    },
    handleScroll(e) {
      this.table.scrollLeft = e.target.scrollLeft
    },
    handleClick(event) {
      const { table } = this
      const cell = getCell(event)
      if (cell) {
        const colid = cell.getAttribute('data-colid')

        const column = colid.split('-').reduce((acc, cur, idx) => {
          const index = +cur - 1
          acc = idx === 0 ? acc[index] : acc.children[index]
          return acc
        }, [...table.visibleColumns])
        if (column) {
          this.checkedColumn({ column, event })
          table.$emit(`header-click`, { column, event })
        }
      }
    },
    checkedColumn({ column, event }) {
      // console.log('column', JSON.stringify(column, null, 2))
      const { table } = this
      if (event.ctrlKey) {
        const { parent } = column
        const handleColumn = parent ? table.visibleColumns[+parent[0] - 1] : column
        const index = table.headerCheckedColumns.findIndex(d => [d].some(c => c === handleColumn))
        if (index === -1) {
          table.headerCheckedColumns.push(handleColumn)
        } else {
          table.headerCheckedColumns.splice(index, 1)
        }
      }
    },
    handleWindowMousedown(e) {
      const { target } = e
      const dragCard = document.querySelector('.table-drag--card')
      if (!this.$el.contains(target) && (dragCard && dragCard.contains(target) || !dragCard)) {
        setTimeout(() => {
          this.table.headerCheckedColumns = []
        }, 100)
      }
    },
    handleMousemove(e) {
      const { table, $refs, dragingTarget, isDraging } = this
      if (!table.border) return
      let target = e.target
      while (target && !hasClass(target, 'eff-table__column')) {
        target = target.parentNode
      }
      if (!target) return
      const header = $refs.header.$el
      const dragMove = $refs.dragMove
      if (target.contains(header) || target === dragMove || dragingTarget === target || isDraging) return

      this.dragingTarget = hasClass(target, 'is--space') ? null : target
    },
    handleMouseleave() {
      !this.isDraging && setTimeout(() => {
        this.dragingTarget = null
      }, 110)
    },
    moveMousedown() {
      const { start, moveing, end } = this
      onMousemove({ start, moveing, end })
    },
    start(e) {
      if (!this.dragingTarget) return
      this.table.lineShow = true
      const { right: columnRight } = this.dragingTarget.getBoundingClientRect()
      this.startX = columnRight + 2
      this.moveing()
    },
    moveing(moveX = 0, moveY) {
      if (!this.dragingTarget) return
      this.isDraging = true

      const columnIndex = this.dragingTarget.dataset.colidx
      const column = this.visibleColumns[columnIndex]

      const { table } = this
      const line = table.$refs.line

      const tableEl = table.$refs.table
      const { left: tableLeft, height: tableHeight, top: tableTop } = tableEl.getBoundingClientRect()
      const { left: columnLeft } = this.dragingTarget.getBoundingClientRect()
      const { edit, sortable, titlePrefix = {}, titleSuffix = {}} = column
      const lefts = [
        { el: true, width: columnLeft + 50 },
        { el: edit, width: 16 },
        { el: sortable, width: 20 },
        { el: titlePrefix.message, width: 18 },
        { el: titleSuffix.message, width: 18 },
        { el: column.rules && Boolean(column.rules.find(d => d.required)), width: 12 }
      ]
      const minLeft = lefts.reduce((acc, cur) => cur.el ? acc + cur.width : acc, 0)

      if (minLeft <= this.startX + moveX) {
        this.moveX = moveX
      }
      const endLeft = this.startX + this.moveX
      const left = Math.max(minLeft, endLeft, tableLeft)

      line.style.cssText = `left:${left}px;top:${tableTop}px;height:${tableHeight}px;`
    },
    end() {
      this.table.lineShow = false
      this.isDraging = false
      const { visibleColumns, dragingTarget, moveX } = this

      const colid = dragingTarget.getAttribute('data-colid')
      const colidx = dragingTarget.getAttribute('data-colidx')
      const width = dragingTarget.offsetWidth + moveX
      let obj = {}
      const ids = colid.split('-').map(d => +d)
      const [, next] = ids
      if (next) {
        const child = ids.reduce((acc, cur, idx) => {
          const num = +cur - 1
          if (idx === 0) {
            obj = visibleColumns[num]
            return obj
          } else {
            return acc.children[num]
          }
        }, {})
        child.width = width
      } else {
        obj = visibleColumns[colidx]
        obj.width = width
      }
      this.$emit('dragend', obj)

      setTimeout(() => {
        if (this.dragingTarget) {
          const { dragMove } = this.$refs
          const { right } = this.dragingTarget.getBoundingClientRect()
          dragMove.style.left = right - dragMove.offsetWidth + 'px'
          this.dragingTarget = null
        }
      }, 100)
    },
    // 右键菜单功能
    contextmenuClick(index, item) {
      const { table, getContextmenuItem } = this
      const tableColumns = [...table.tableColumns]
      const { column: oldItem, columnIndex: oldIndex } = getContextmenuItem(index)
      // console.log({ oldItem, oldIndex })
      let newIndex = 0
      switch (item.title) {
        case '前移一列':
          newIndex = oldIndex - tableColumns.slice(0, oldIndex).reverse().findIndex(d => d.show !== false) - 1
          tableColumns.splice(oldIndex, 1)
          tableColumns.splice(newIndex, 0, oldItem)
          break
        case '后移一列':
          newIndex = oldIndex - tableColumns.slice(oldIndex).findIndex(d => d.show !== false) + 1
          tableColumns.splice(oldIndex, 1)
          tableColumns.splice(newIndex, 0, oldItem)
          break
        case '移到首列':
          newIndex = oldIndex - tableColumns.slice(oldIndex).findIndex(d => d.show !== false) + 1
          tableColumns.splice(oldIndex, 1)
          tableColumns.unshift(oldItem)
          break
        case '移到尾列':
          newIndex = oldIndex - tableColumns.slice(oldIndex).findIndex(d => d.show !== false) + 1
          tableColumns.splice(oldIndex, 1)
          tableColumns.push(oldItem)
          break
        case '设为左固定列':
          tableColumns[oldIndex].fixed = 'left'
          break
        case '设为右固定列':
          tableColumns[oldIndex].fixed = 'right'
          break
        case '取消固定列':
          tableColumns[oldIndex].fixed = ''
          break
        case '隐藏列':
          tableColumns[oldIndex].show = false
          break

        default:
          break
      }
      this.table.tableColumns = [...tableColumns]
    },
    getContextmenuItem(columnIndex) {
      const { fixed, table } = this
      const { tableColumns, visibleColumns, fixedColumns } = table
      let cur = visibleColumns[columnIndex]
      if (fixed) {
        cur = fixedColumns[fixed][columnIndex]
        columnIndex = tableColumns.findIndex(column => [column].some(d => d === cur))
      }
      return { column: cur, columnIndex }
    },
    contextmenuListMethod(index) {
      const { fixed, table, getContextmenuItem } = this
      const { tableColumns, overflowX } = table
      const { column, columnIndex } = getContextmenuItem(index)
      const { type } = column
      const lefts = tableColumns.slice(0, columnIndex).filter(d => d.show !== false)
      const rights = tableColumns.slice(columnIndex + 1).filter(d => d.show !== false)
      const onType = !type
      const prev = onType && !column.fixed && lefts.find(d => !d.fixed)
      const next = onType && !column.fixed && rights.find(d => !d.fixed)
      // console.log('column', JSON.stringify(column, null, 2))
      this.contextmenuList = [
        { title: '前移一列', fixed, disabled: false, show: prev },
        { title: '后移一列', fixed, disabled: false, show: next },
        { title: '移到首列', fixed, disabled: false, show: prev },
        { title: '移到尾列', fixed, disabled: false, show: next },
        { title: '设为左固定列', fixed, disabled: false, show: overflowX && column.fixed !== 'left' },
        { title: '设为右固定列', fixed, disabled: false, show: overflowX && column.fixed !== 'right' },
        { title: '取消固定列', fixed, disabled: false, show: overflowX && column.fixed },
        { title: '隐藏列', fixed, disabled: false, show: true }
      ]
    }
  },
  mounted() {
    this.table.headerLoad = true
    on(this.$el, 'scroll', this.handleScroll)
    this.$nextTick(() => {
      this.height = this.$refs.header.offsetHeight
    })
  },
  beforeDestroy() {
    off(this.$el, 'scroll', this.handleScroll)
  },
  render(h) {
    const { table, visibleColumns, bodyColumns, isDraging, handleClick, handleMousemove, handleMouseleave, renderColumns, dragStyle, moveMousedown, isColumnsChange, searchData, contextmenuList, contextmenuListMethod, contextmenuClick } = this
    const { showSpace, search, drag, headerContextmenu, heights: { headerHeight }} = table
    const height = headerHeight + 'px'
    const renderCols = renderColumns(visibleColumns)
    // 将多选表头进行分组，用于多列拖动
    if (this.checkedColumnGroup.length) {
      this.checkedColumnGroup.forEach(check => {
        const columnGroup = <div class='eff-table__header-checked'>{check.reduce((acc, cur) => acc.concat(renderCols[+cur - 1]), [])}</div>
        renderCols.splice(+check[0] - 1, check.length, columnGroup)
      })
    }

    return (
      <div class='eff-table__header-wrapper'>
        {
          h('Contextmenu', {
            props: { list: contextmenuList, listMethod: contextmenuListMethod, disabled: !drag || !headerContextmenu },
            class: { 'eff-table__header': true, 'is--move': isDraging },
            ref: 'header',
            style: { height },
            nativeOn: {
              click: handleClick,
              mousemove: handleMousemove,
              mouseleave: handleMouseleave
            },
            on: {
              'item-click': contextmenuClick
            }
          }, [
            renderCols,
            showSpace ? <div class='eff-table__column is--space' style={height} /> : '',
            <div
              ref='dragMove'
              class='header-drag-move'
              style={dragStyle}
              on-mousedown={moveMousedown}
            />
          ])
        }
        {
          search && !isColumnsChange && table.searchShow ? <Search
            value={searchData}
            columns={bodyColumns}
            showSpace={showSpace}
            on-input={val => (this.searchData = val)}
            on-change={table.searchChange}
          /> : ''
        }
      </div>
    )
  }
}

