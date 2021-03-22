import TableHeaderColumn from './TableHeaderColumn'
import Search from '../components/Search'
import { on, off, hasClass, onMousemove, getCell } from 'utils/dom'

export default {
  name: 'TableHeader',
  props: {
    visibleColumns: { type: Array, default: () => [] },
    bodyColumns: { type: Array, default: () => [] },
    fixed: { type: String, default: '' }
  },
  components: { TableHeaderColumn, Search },
  data() {
    return {
      dragingTarget: null,
      height: 0,
      isDraging: false,
      isColumnsChange: false,
      searchData: []
    }
  },
  watch: {
    'table.scrollLeft'(val) {
      if (this.fixed) return
      this.$el.scrollLeft = val
    },
    'table.columns'() {
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
  render(h) {
    const { table, visibleColumns, bodyColumns, isDraging, handleClick, handleMousemove, handleMouseleave, renderColumns, dragStyle, moveMousedown, isColumnsChange, searchData } = this
    const { showSpace, search, heights: { headerHeight }} = table
    const height = headerHeight + 'px'

    return (
      <div class='eff-table__header-wrapper'>
        <div
          class={{ 'eff-table__header': true, 'is--move': isDraging }}
          ref= 'header'
          style={{ height }}
          on-click={handleClick}
          on-mousemove={handleMousemove}
          on-mouseleave={handleMouseleave}
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
        </div>
        {
          search && !isColumnsChange ? <Search
            value={searchData}
            columns={bodyColumns}
            showSpace={showSpace}
            on-input={val => (this.searchData = val)}
            on-change={val => table.$emit('search-change', val)}
          /> : ''
        }
      </div>
    )
  },
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
              <div class='header-title' style={{ maxHeight: rowHeight + 'px', borderLeft: columnIndex === 0 ? 0 : '' }}>
                {column.title}
              </div>
              <div class='header-children'>
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
      this.moveX = moveX

      const { table } = this
      const line = table.$refs.line

      const tableEl = table.$refs.table
      const { left: tableLeft, height: tableHeight, top: tableTop } = tableEl.getBoundingClientRect()
      const { left: columnLeft } = this.dragingTarget.getBoundingClientRect()
      const minLeft = columnLeft + 40
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
  }
}

