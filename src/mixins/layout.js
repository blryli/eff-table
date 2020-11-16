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
      let tClass = 'eff-table'
      this.overflowX && (tClass += ' is-overflow--x')
      this.overflowY && (tClass += ' is-overflow--y')
      this.border && (tClass += ' is-border')
      return tClass
    },
    rowStyle() {
      const style = {}
      style.height = this.rowHeight + 'px'
      if (this.overflowX) {
        style.maxWidth = this.bodyWidth + 'px'
      }
      return style
    },
    fixedHeight() {
      if (this.showSummary) {
        return ''
      }
      const { headerHeight, bodyHeight, searchHeight } = this.heights
      let height = headerHeight + bodyHeight + searchHeight
      this.overflowX && (height -= 17)
      return height + 'px'
    },
    scrollYwidth() {
      return this.overflowY ? 17 : 0
    },
    isScrollRightEnd() {
      return this.bodyWrapperWidth + this.scrollLeft > this.bodyWidth + this.scrollYwidth
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
      return bodyHeight && (maxHeight ? dataHeight > maxHeight : dataHeight > bodyHeight)
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
    }
  },
  methods: {
    resize() {
      this.$nextTick(() => {
        this.bodyWrapperWidth = this.$el.getBoundingClientRect().width || this.minWidth
        this.setOverflowX()
        this.scrollLeftEvent()
        this.tableBody = this.$el.querySelector('.eff-table__body')
      })
    },
    setOverflowX() {
      const { minWidth, bodyWrapperWidth } = this
      this.bodyWidth = Math.max(bodyWrapperWidth, minWidth) - 2 - (this.overflowY ? 17 : 0)
      this.overflowX = minWidth > bodyWrapperWidth - this.scrollYwidth
    },
    doLayout() {
      this.resize()
    }
  },
  activated() {
    setTimeout(() => {
      this.resize()
    }, 300)
  },
  mounted() {
    this.resize()
    let num = 0
    this.timer = setInterval(() => {
      num++
      this.bodyWrapperWidth = this.$el.getBoundingClientRect().width
      if (this.bodyWrapperWidth || num === 30) {
        clearInterval(this.timer)
      }
    }, 100)
  },
  beforeDestroy() {
    off(window, 'resize', this.resize, { passive: true })
  }
}
