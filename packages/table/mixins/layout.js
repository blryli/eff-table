import { on, off } from 'pk/utils/dom'
import XEUtils from 'xe-utils'

export default {
  data() {
    return {
      tableRect: null,
      bodyWidth: 0,
      bodyHeight: 0,
      bodyWrapperWidth: 0,
      screenfullHeight: 0,
      offset: 0,
      overflowX: false,
      headerLoad: false,
      bodyLoad: false,
      toolbarHeight: 0,
      formHeight: 0
    }
  },
  created() {
    on(window, 'resize', this.resize, { passive: true })
  },
  watch: {
    isScreenfull(val) {
      if (val) {
        this.tableMaxHeight = window.screen.height
        this.layoutTimer = setTimeout(() => {
          this.resize()
          val && this.$nextTick(() => {
            this.screenfullHeight = this.$el.getBoundingClientRect().height
          })
        }, 0)
      } else {
        this.tableMaxHeight = this.maxHeight
        this.layoutTimer = null
      }
    }
  },
  computed: {
    isRowHeightAuto() {
      return this.rowHeight === 'auto'
    },
    tableClass() {
      let tClass = 'eff-table__container'
      const { stripe, heights } = this
      const { bodyHeight, dataHeight } = heights
      stripe && (tClass += ' is--stripe')
      bodyHeight === dataHeight && (tClass += ' is-bottom--coincide')
      return tClass
    },
    tableStyle() {
      const style = {}
      const { $scopedSlots: { table }, heights } = this
      if (table) {
        style.height = heights.tableWrapperHeight + 'px'
      }
      return style
    },
    bodyRenderWidth() {
      const { columnIsVirtual, widths: { columnWidths }, columnRenderIndex, columnRenderEndIndex, bodyWidth } = this
      return columnIsVirtual && columnRenderEndIndex ? columnWidths.slice(columnRenderIndex, columnRenderEndIndex).reduce((acc, cur) => acc + cur, 0) : bodyWidth
    },
    fixedHeight() {
      const { heights, overflowX } = this
      const { headerHeight, bodyHeight, searchHeight } = heights
      let height = headerHeight + bodyHeight + searchHeight
      overflowX && (height -= 17)
      return height + 'px'
    },
    scrollYwidth() {
      return this.overflowY ? 17 : 0
    },
    scrollXwidth() {
      return this.overflowX ? 17 : 0
    },
    isScrollRightEnd() {
      const { bodyWrapperWidth, scrollLeft, bodyWidth, scrollYwidth } = this
      return bodyWrapperWidth + scrollLeft > bodyWidth + scrollYwidth
    },
    headerRanked() {
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

      return getDeepth(this.visibleColumns)
    },
    overflowY() {
      const { isRowHeightAuto, bodyHeight: bodyAllHeight, scrollXwidth } = this
      const { bodyHeight, tableMaxHeight, dataHeight } = this.heights
      const height = isRowHeightAuto ? bodyAllHeight : dataHeight
      return bodyHeight && (tableMaxHeight ? height - 2 > bodyHeight : height - 2 > bodyHeight - scrollXwidth)
    },
    expandsHeight() {
      return this.expands.reduce((acc, cur) => cur.expanded ? acc + cur.height : acc, 0)
    },
    // 100%高度
    autoHeight() {
      const { tableRect, height } = this
      return XEUtils.toFixed(tableRect ? window.innerHeight - tableRect.top - 20 : height, 2)
    },
    // 自定义行高
    rowsHeight() {
      const rowConfig = this.rowConfig || {}
      const rows = (rowConfig.rows || [])
      return rows.length ? rows.reduce((acc, cur) => acc + (cur.height || 30), 0) : 0
    },
    // 实际行高度=行高+自定义行高
    calcRowHeight() {
      const { _rowHeight, rowsHeight } = this
      return _rowHeight + rowsHeight
    },
    heights() {
      const { height, isRowHeightAuto, tableMaxHeight, autoHeight, isScreenfull, screenfullHeight, afterData, _rowHeight, baseHeight, headerRowHeight, headerRanked, search, headerLoad, bodyLoad, overflowX, treeNum, subtotalData, expandsHeight, formHeight, toolbarHeight: tHeight, $EFF: { HeaderRowHeight: EFFHeaderRowHeight }, calcRowHeight } = this
      const { toolbar, header, footer, footerAction } = this.$refs
      const toolbarHeight = toolbar ? tHeight : 0
      const headerHeight = headerLoad && header ? ((headerRowHeight === 36 ? EFFHeaderRowHeight || headerRowHeight : headerRowHeight) || baseHeight) * headerRanked : 0
      const searchHeight = search ? baseHeight : 0
      const footerHeight = footer ? baseHeight : 0
      const footerActionHeight = footerAction ? baseHeight : 0
      const dataHeight = isRowHeightAuto ? this.bodyHeight : afterData.length ? afterData.length * calcRowHeight + (treeNum + subtotalData.length) * _rowHeight + expandsHeight : _rowHeight
      const overflowXHeight = (overflowX ? 17 : 0)
      const tableHeight = isScreenfull ? screenfullHeight : height === '100%' ? autoHeight : tableMaxHeight || height || formHeight + toolbarHeight + headerHeight + searchHeight + footerHeight + footerActionHeight + dataHeight
      let bodyHeight = (bodyLoad ? tableHeight - formHeight - toolbarHeight - headerHeight - footerHeight - footerActionHeight - searchHeight : 0)
      if (tableMaxHeight && (dataHeight + overflowXHeight) <= bodyHeight || !height && !tableMaxHeight) {
        bodyHeight = dataHeight + overflowXHeight
      }
      const tableWrapperHeight = tableHeight - formHeight - toolbarHeight - footerHeight - footerActionHeight
      return {
        formHeight,
        toolbarHeight,
        tableWrapperHeight,
        tableHeight,
        dataHeight,
        tableMaxHeight,
        headerHeight,
        searchHeight,
        footerHeight,
        footerActionHeight,
        bodyHeight: Math.max(bodyHeight - 2, _rowHeight)
      }
    },
    bodyRect() {
      const { columnIsVirtual, bodyWrapper } = this
      if (!columnIsVirtual || !bodyWrapper) return {}
      const { left, right } = bodyWrapper.getBoundingClientRect()
      const { leftWidth, rightWidth } = this.widths
      return { bodyLeft: left + leftWidth, bodyRight: right + rightWidth }
    }
  },
  methods: {
    getFixedStyle(fixed) {
      const style = {}
      const { isVirtual, rowHeight, fixedHeight, bodyWidth, widths, scrollYwidth } = this
      const width = !isVirtual && rowHeight === 'auto' ? bodyWidth + scrollYwidth : widths[fixed + 'Width']
      style.width = width + scrollYwidth + 'px'
      style.height = fixedHeight
      return style
    },
    getBodyWidth() {
      let node = this.$el
      while (node && node.parentNode && node.getBoundingClientRect().width === 0) {
        node = node.parentNode || this.$el
      }
      return node.getBoundingClientRect().width
    },
    resize() {
      this.$nextTick(() => {
        const { setOverflowX, scrollLeft, scrollTop, handleScroll, isRowHeightAuto } = this
        const { body } = this.$refs
        if (body) {
          this.bodyWrapper = body.$el
          this.bodyWrapperWidth = this.getBodyWidth()
          setOverflowX()
          handleScroll(scrollLeft + 0.01, scrollTop + 0.01, '#')
        } else {
          !this.$scopedSlots.table && this.resize()
        }
        const timer = setTimeout(() => {
          this.setTableRect()
          clearTimeout(timer)
        }, 100)
      })
    },
    setOverflowX() {
      const { bodyWrapperWidth, scrollYwidth, minWidth, widths: { allMinWidth }} = this
      this.bodyWidth = Math.max(bodyWrapperWidth - 2, minWidth, allMinWidth) - scrollYwidth
      this.overflowX = minWidth > (bodyWrapperWidth - 1 - scrollYwidth) || allMinWidth > minWidth && allMinWidth > (bodyWrapperWidth - 1 - scrollYwidth)
    },
    doLayout() {
      this.resize()
    },
    setTableRect() {
      const tableWrapper = this.$refs.tableWrapper
      if (!tableWrapper) return
      this.tableRect = tableWrapper.getBoundingClientRect()
    }
  },
  activated() {
    this.resize()
  },
  mounted() {
    this.resize()
  },
  beforeDestroy() {
    off(window, 'resize', this.resize, { passive: true })
    clearTimeout(this.timer)
  }
}
