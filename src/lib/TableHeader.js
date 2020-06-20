import TableHeaderColumn from './TableHeaderColumn'
import TableSearchColumn from './TableSearchColumn'
import { on, off, hasClass, onMousemove, getCell } from 'utils/dom'

export default {
  name: 'TableHeader',
  components: { TableHeaderColumn, TableSearchColumn },
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
    }
  },
  inject: ['table'],
  render(h) {
    const { rowStyle, visibleColumns, showSpace, search } = this.$parent
    return (
      <div class='eff-table__header-wrapper'>
        <div
          class={{ 'eff-table__header': true, 'is--move': this.isDraging }}
          ref= 'header'
          style={rowStyle}
          on-click={this.handleClick}
          on-mousemove={this.handleMousemove}
          on-mouseleave={this.handleMouseleave}
        >
          {
            visibleColumns.map((column, columnIndex) => {
              return <TableHeaderColumn
                column={column}
                columnIndex={columnIndex}
              />
            })
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
          search
            ? <div
              class='eff-table__search'
              ref= 'search'
              style={rowStyle}
            >
              {
                visibleColumns.map((column, columnIndex) => {
                  return <TableSearchColumn
                    column={column}
                    columnIndex={columnIndex}
                  />
                })
              }
              {
                showSpace ? <div class='eff-table__column is--space' /> : ''
              }
            </div> : ''
        }
      </div>
    )
  },
  methods: {
    handleScroll(e) {
      this.$parent.bodyScrollLeft = e.target.scrollLeft
    },
    handleClick(event) {
      const table = this.table
      const cell = getCell(event)
      let column
      if (cell) {
        const columnIndex = cell.getAttribute('data-colid')
        column = table.visibleColumns[columnIndex - 1]
        if (column) {
          table.$emit(`header-click`, { column, columnIndex, cell, event })
        }
      }
    },
    handleMousemove(e) {
      if (!this.$parent.border) return
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
      this.$parent.lineShow = true
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
      this.$parent.lineShow = false
      this.isDraging = false

      const colid = this.dragingTarget.getAttribute('data-colid')
      this.$emit('dragend', this.$parent.visibleColumns[colid], this.dragingTarget.offsetWidth + this.moveX)

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

