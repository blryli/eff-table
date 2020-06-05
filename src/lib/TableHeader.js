import EffTableHeaderColumn from './TableHeaderColumn'
import { on, off, hasClass, onMousemove } from 'utils/dom'

export default {
  name: 'EffTableHeader',
  components: { EffTableHeaderColumn },
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
  render(h) {
    return (
      <div class='eff-table__header-wrapper'>
        <div
          class={{ 'eff-table__header': true, 'is--move': this.isDraging }}
          ref= 'header'
          style={this.$parent.rowStyle}
          on-click={this.handleClick}
          on-mousemove={this.handleMousemove}
          on-mouseleave={this.handleMouseleave}
        >
          {
            this.$parent.columns.reduce((acc, column, columnIndex) => {
              return column.show !== false ? acc.concat(<EffTableHeaderColumn
                column={column}
                columnIndex={columnIndex}
              />) : acc
            }, [])
          }
          {
            this.$parent.minWidth <= this.$parent.bodyWidth ? <div class='eff-table__column is--space' /> : null
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
      </div>
    )
  },
  methods: {
    handleScroll(e) {
      this.$parent.bodyScrollLeft = e.target.scrollLeft
    },
    handleClick(e) {
      this.$parent.$emit('header-click', e)
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
      !this.isDraging && (this.dragingTarget = null)
    },
    moveMousedown() {
      onMousemove({
        start: this.start,
        moveing: this.moveing,
        end: this.end
      })
    },
    start(e) {
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
      this.$emit('dragend', this.$parent.columns[colid], this.dragingTarget.offsetWidth + this.moveX)

      setTimeout(() => {
        const dragMove = this.$refs.dragMove
        const { right } = this.dragingTarget.getBoundingClientRect()
        dragMove.style.left = right - dragMove.offsetWidth + 'px'
        this.dragingTarget = null
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

