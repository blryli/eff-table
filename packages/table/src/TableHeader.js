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
      const render = (columns, colid = '') => {
        return columns.reduce((acc, column, columnIndex) => {
          const { children = [] } = column
          const parent = colid ? `${colid}-${columnIndex + 1}` : `${columnIndex + 1}`
          if (children.length) {
            acc.push(<div class='eff-table__header-group'>
              <div class='eff-table__header-group-title' style={{ maxHeight: rowHeight + 'px', borderLeft: columnIndex === 0 ? 0 : '' }}>
                {column.title}
              </div>
              <div class='eff-table__header-group-children'>
                {
                  render(children, parent)
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
      let column
      if (cell) {
        const columnIndex = cell.getAttribute('data-colidx')
        column = table.bodyColumns[columnIndex]
        if (column) {
          table.$emit(`header-click`, { column, columnIndex, cell, event })
        }
      }
    },
    handleMousemove(e) {
      console.log('handleMousemove')
      const { table, $refs, dragingTarget, isDraging } = this
      if (!table.border) return
      let target = e.target
      while (target && !hasClass(target, 'eff-table__column')) {
        target = target.parentNode
      }
      if (!target) return
      const header = $refs.header
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
    contextmenuClick(index, item) {
      const { table, getContextmenuItem } = this
      const tableColumns = [...table.tableColumns]
      const { column: oldItem, columnIndex: oldIndex } = getContextmenuItem(index)
      console.log({ oldItem, oldIndex })
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
      const { tableColumns, fixedColumns } = table
      let cur = tableColumns[columnIndex]
      if (fixed) {
        cur = fixedColumns[fixed][columnIndex]
        columnIndex = tableColumns.findIndex(column => [column].some(d => d === cur))
      }
      return { column: cur, columnIndex }
    },
    contextmenuListMethod(index) {
      const { fixed, table, getContextmenuItem } = this
      const { visibleColumns } = table
      const { column, columnIndex } = getContextmenuItem(index)
      const { type } = column
      const lefts = visibleColumns.slice(0, columnIndex)
      const rights = visibleColumns.slice(columnIndex + 1)
      const onType = !type
      const prev = onType && !column.fixed && lefts.find(d => !d.fixed)
      const next = onType && !column.fixed && rights.find(d => !d.fixed)
      console.log('column', JSON.stringify(column, null, 2))
      this.contextmenuList = [
        { title: '前移一列', fixed, disabled: false, show: prev },
        { title: '后移一列', fixed, disabled: false, show: next },
        { title: '移到首列', fixed, disabled: false, show: prev },
        { title: '移到尾列', fixed, disabled: false, show: next },
        { title: '设为左固定列', fixed, disabled: false, show: column.fixed !== 'left' },
        { title: '设为右固定列', fixed, disabled: false, show: column.fixed !== 'right' },
        { title: '取消固定列', fixed, disabled: false, show: column.fixed },
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
    const { table, visibleColumns, bodyColumns, fixed, isDraging, handleClick, handleMousemove, handleMouseleave, renderColumns, dragStyle, moveMousedown, isColumnsChange, searchData, contextmenuList, contextmenuListMethod, contextmenuClick } = this
    const { showSpace, search, heights: { headerHeight }} = table
    const height = headerHeight + 'px'

    return (
      <div class='eff-table__header-wrapper'>
        <Contextmenu
          list={contextmenuList}
          listMethod={contextmenuListMethod}
          class={{ 'eff-table__header': true, 'is--move': isDraging }}
          ref= 'header'
          fixed={fixed}
          style={{ height }}
          on-click_native={handleClick}
          on-mousemove_native={handleMousemove}
          on-mouseleave_native={handleMouseleave}
          on-item-click={contextmenuClick}
        >
          {
            renderColumns(visibleColumns)
          }
          {
            showSpace ? <div class='eff-table__column is--space' style={height} /> : ''
          }
          {
            <div
              ref='dragMove'
              class='header-drag-move'
              style={dragStyle}
              on-mousedown={moveMousedown}
            />
          }
        </Contextmenu>
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

