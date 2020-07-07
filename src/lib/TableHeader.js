import TableHeaderColumn from './TableHeaderColumn'
import Search from '../components/Search'
import { on, off, hasClass, onMousemove, getCell } from 'utils/dom'

export default {
  name: 'TableHeader',
  components: { TableHeaderColumn, Search },
  data() {
    return {
      dragingTarget: null,
      height: 0,
      isDraging: false
    }
  },
  watch: {
    '$parent.bodyScrollLeft'(val) {
      this.$el.scrollLeft = val
    }
  },
  computed: {
    dragStyle() {
      const { top, left, width } = this.dragingTarget && this.dragingTarget.getBoundingClientRect() || {}
      return {
        display: this.dragingTarget ? 'block' : 'none',
        height: this.height + 'px',
        top: top + 'px',
        left: left + width - 8 + 'px'
      }
    },
    // 获取columns嵌套层级
    ranked() {
      function getDeepth(array) {
        function sum(arr, flag) {
          return arr.reduce((acc, cur) => {
            let accDeepth
            const { children } = cur
            if (Array.isArray(children)) {
              accDeepth = sum(children, flag + 1)
            }
            return accDeepth > acc ? accDeepth : acc
          }, flag)
        }
        return sum(array, 1)
      }

      return getDeepth(this.table.visibleColumns)
    }
  },
  inject: ['table'],
  render(h) {
    const { rowStyle, visibleColumns, bodyColumns, showSpace, rowHeight, search } = this.table
    return (
      <div class='eff-table__header-wrapper'>
        <div
          class={{ 'eff-table__header': true, 'is--move': this.isDraging }}
          ref= 'header'
          style={{ ...rowStyle, ...{ height: rowHeight * this.ranked + 'px' }}}
          on-click={this.handleClick}
          on-mousemove={this.handleMousemove}
          on-mouseleave={this.handleMouseleave}
        >
          {
            this.renderColumns(visibleColumns)
          }
          {
            showSpace ? <div class='eff-table__column is--space' /> : ''
          }
          {
            <div
              ref='dragMove'
              class='header-drag-move'
              style={this.dragStyle}
              on-mousedown={this.moveMousedown}
            />
          }
        </div>
        {
          search ? <Search styles={rowStyle} columns={bodyColumns} showSpace={showSpace} /> : ''
        }
      </div>
    )
  },
  methods: {
    renderColumns(columns) {
      let index = 0
      const { rowHeight } = this.table
      function render(columns, colid = '') {
        return columns.reduce((acc, column, columnIndex) => {
          const { children = [] } = column
          const parent = colid ? `${colid}-${columnIndex + 1}` : `${index + 1}`
          if (column.prop && children.length) {
            const plat = arr => {
              return arr.reduce((acc, cur) => {
                const { children = [] } = cur
                return children.length ? acc.concat(plat(children)) : acc.concat(cur)
              }, [])
            }
            const width = plat(children).reduce((acc, cur) => acc + (cur.width || 40), 0)
            acc.push(<div class='eff-table__header-group' style={{ maxWidth: width + 'px', minWidth: width + 'px' }}>
              <div class='header-title' style={{ maxHeight: rowHeight + 'px' }}>
                {column.title}
              </div>
              <div class='header-children'>
                {
                  render(children, parent)
                }
              </div>
            </div>)
          } else {
            acc.push(<TableHeaderColumn
              colid={parent}
              column={column}
              columnIndex={index}
            />)
            index += 1
          }
          return acc
        }, [])
      }
      return render(columns)
    },
    handleScroll(e) {
      this.table.bodyScrollLeft = e.target.scrollLeft
    },
    handleClick(event) {
      const { table } = this
      const cell = getCell(event)
      let column
      if (cell) {
        const columnIndex = cell.getAttribute('data-colidx')
        column = table.bodyColumns[columnIndex]
        if (column) {
          console.log(column)
          table.$emit(`header-click`, { column, columnIndex, cell, event })
        }
      }
    },
    handleMousemove(e) {
      if (!this.table.border) return
      let target = e.target
      while (target && !hasClass(target, 'eff-table__column')) {
        target = target.parentNode
      }
      if (!target) return
      const header = this.$refs.header
      const dragMove = this.$refs.dragMove
      if (target.contains(header) || target === dragMove || this.dragingTarget === target || this.isDraging) return

      this.dragingTarget = hasClass(target, 'is--space') ? null : target
    },
    handleMouseleave() {
      !this.isDraging && setTimeout(() => {
        this.dragingTarget = null
      }, 110)
    },
    moveMousedown() {
      onMousemove({
        start: this.start,
        moveing: this.moveing,
        end: this.end
      })
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

      const { $parent } = this
      const line = $parent.$refs.line

      const tableEl = $parent.$refs.table
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

      const colid = this.dragingTarget.getAttribute('data-colid')
      const width = this.dragingTarget.offsetWidth + this.moveX
      let obj = {}
      const ids = colid.split('-')
      const [start, next] = ids
      if (next) {
        obj = ids.reduce((acc, cur, idx) => {
          const num = +cur - 1
          if (idx === 0) {
            return this.table.visibleColumns[num]
          } else {
            return acc.children[num]
          }
        }, {})
      } else {
        obj = this.table.visibleColumns[start - 1]
      }
      obj.width = width
      console.log(obj)
      this.$emit('dragend', this.table.visibleColumns[start])

      setTimeout(() => {
        if (this.dragingTarget) {
          const dragMove = this.$refs.dragMove
          const { right } = this.dragingTarget.getBoundingClientRect()
          dragMove.style.left = right - dragMove.offsetWidth + 'px'
          this.dragingTarget = null
        }
      }, 100)
    }
  },
  mounted() {
    on(this.$el, 'scroll', this.handleScroll)
    this.$nextTick(() => {
      this.height = this.$refs.header.offsetHeight
    })
  },
  beforeDestroy() {
    off(this.$el, 'scroll', this.handleScroll)
  }
}

