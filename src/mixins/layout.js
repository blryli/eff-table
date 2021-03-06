import { on, off } from 'utils/dom'
export default {
  data() {
    return {
      bodyWidth: 0,
      bodyWrapperWidth: 0,
      offset: 0,
      overflowX: false,
      headerLoad: false,
      bodyLoad: false
    }
  },
  created() {
    on(window, 'resize', this.resize, { passive: true })
  },
  watch: {
    isScreenfull() {
      setTimeout(() => {
        this.resize()
      }, 0)
    }
  },
  computed: {
    tableClass() {
      let tClass = 'eff-table__container'
      const { overflowX, overflowY, border } = this
      overflowX && (tClass += ' is-overflow--x')
      overflowY && (tClass += ' is-overflow--y')
      border && (tClass += ' is-border')
      return tClass
    },
    bodyRenderWidth() {
      const { columnIsVirtual, columnWidths, columnRenderIndex, columnRenderEndIndex, bodyWidth } = this
      return columnIsVirtual ? columnWidths.slice(columnRenderIndex, columnRenderEndIndex).reduce((acc, cur) => acc + cur, 0) : bodyWidth
    },
    fixedHeight() {
      const { showSummary, heights, overflowX } = this
      if (showSummary) {
        return ''
      }
      const { headerHeight, bodyHeight, searchHeight } = heights
      let height = headerHeight + bodyHeight + searchHeight
      overflowX && (height -= 17)
      return height + 'px'
    },
    scrollYwidth() {
      return this.overflowY ? 17 : 0
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
      const { bodyHeight, maxHeight, dataHeight } = this.heights
      const overflowXHeight = (this.overflowX ? 17 : 0)
      return bodyHeight && (maxHeight ? dataHeight > maxHeight : dataHeight > bodyHeight - overflowXHeight)
    },
    heights() {
      const { height, maxHeight, isScreenfull, data, rowHeight, headerRanked, search, headerLoad, bodyLoad, overflowX } = this
      const { toolbar, header, footer } = this.$refs

      const tableHeight = isScreenfull ? window.screen.height : maxHeight || height || 400
      const toolbarHeight = toolbar ? rowHeight : 0
      const headerHeight = headerLoad && header ? rowHeight * headerRanked : 0
      const searchHeight = search ? rowHeight : 0
      const footerHeight = footer ? rowHeight : 0
      const dataHeight = data.length ? data.length * rowHeight : rowHeight
      const overflowXHeight = (overflowX ? 17 : 0)
      let bodyHeight = bodyLoad ? tableHeight - toolbarHeight - headerHeight - footerHeight - searchHeight : 0
      if (maxHeight && (dataHeight + overflowXHeight) <= bodyHeight) {
        bodyHeight = dataHeight + overflowXHeight
      }
      return {
        tableHeight,
        dataHeight,
        toolbarHeight,
        headerHeight,
        searchHeight,
        footerHeight,
        bodyHeight: Math.max(bodyHeight, rowHeight)
      }
    },
    bodyRect() {
      const { columnIsVirtual, bodyWrapper } = this
      if (!columnIsVirtual || !bodyWrapper) return {}
      const { left, right } = bodyWrapper.getBoundingClientRect()
      const { leftWidth, rightWidth } = this
      return { bodyLeft: left + leftWidth, bodyRight: right + rightWidth }
    }
  },
  methods: {
    resize() {
      this.$nextTick(() => {
        const { $el, minWidth, setOverflowX, scrollLeftEvent } = this
        this.bodyWrapper = this.$refs.body.$el
        this.bodyWrapperWidth = $el.getBoundingClientRect().width || minWidth
        setOverflowX()
        scrollLeftEvent()
        this.tableBody = $el.querySelector('.eff-table__body')
      })
    },
    setOverflowX() {
      const { minWidth, bodyWrapperWidth, scrollYwidth } = this
      this.bodyWidth = Math.max(bodyWrapperWidth - 2, minWidth) - scrollYwidth
      this.overflowX = minWidth > (bodyWrapperWidth - 2 - scrollYwidth)
    },
    doLayout() {
      this.resize()
    }
  },
  activated() {
    this.timer = setTimeout(() => {
      this.resize()
      clearTimeout(this.timer)
    }, 300)
  },
  mounted() {
    this.resize()
    this.timer = setTimeout(() => {
      this.resize()
      clearTimeout(this.timer)
    }, 300)
  },
  beforeDestroy() {
    off(window, 'resize', this.resize, { passive: true })
    clearTimeout(this.timer)
  }
}
