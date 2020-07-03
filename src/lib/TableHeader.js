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
    ranked() {
      let num = 1
      const ranked = arr => {
        arr.forEach(d => {
          const { children = [] } = d
          if (children.length) {
            num++
            ranked(children)
          }
        })
      }
      ranked(this.table.visibleColumns)
      return num
    }
  },
  inject: ['table'],
  render(h) {
    const { rowStyle, visibleColumns, showSpace, rowHeight, search } = this.table
    return (
      <div class='eff-table__header-wrapper'>
        <div
          class={{ 'eff-table__header': true, 'is--move': this.isDraging }}
          ref= 'header'
          style={{ ...{ rowStyle }, ...{ height: rowHeight * this.ranked + 'px' }}}
          on-click={this.handleClick}
          on-mousemove={this.handleMousemove}
          on-mouseleave={this.handleMouseleave}
        >
          {
            visibleColumns.map((column, columnIndex) => this.renderColumns(column, columnIndex))
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
          search ? <Search styles={rowStyle} columns={visibleColumns} showSpace={showSpace} /> : ''
        }
      </div>
    )
  },
  methods: {
    renderColumns(column, columnIndex, colid) {
      const { children = [] } = column
      if (!colid) colid = `${columnIndex + 1}`
      if (column.prop && children.length) {
        const width = children.reduce((acc, cur) => acc + cur.width, 0)
        return <div class='eff-table__header-group' style={{ maxWidth: width + 'px', minWidth: width + 'px' }}>
          <div class='header-title' style={{ height: this.table.rowHeight + 'px' }}>
            {column.title}
          </div>
          <div class='header-children'>
            {
              children.map((col, idx) => this.renderColumns(col, idx, `${colid}-${idx + 1}`))
            }
          </div>
        </div>
      } else {
        return <TableHeaderColumn
          colid={colid}
          column={column}
          columnIndex={columnIndex}
        />
      }
    },
    handleScroll(e) {
      this.table.bodyScrollLeft = e.target.scrollLeft
    },
    handleClick(event) {
      const table = this.table
      const cell = getCell(event)
      let column
      if (cell) {
        const columnIndex = cell.getAttribute('data-colid')
        column = table.visibleColumns[columnIndex]
        if (column) {
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
            console.log(acc)
            return acc.children[num]
          }
        }, {})
      } else {
        obj = this.table.visibleColumns[start]
      }
      obj.width = width
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

