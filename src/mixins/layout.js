import { on, off } from 'utils/dom'
export default {
  data() {
    return {
      bodyWidth: 0,
      bodyWrapperWidth: 0,
      offset: 0,
      bodyOverflowX: false,
      bodyScrollLeft: 0,
      headerLoad: false,
      bodyLoad: false
    }
  },
  created() {
    on(window, 'resize', this.resize, { passive: true })
  },
  watch: {
    data() {
      this.resize()
    },
    isScreenfull() {
      setTimeout(() => {
        this.resize()
      }, 0)
    }
  },
  computed: {
    tableClass() {
      let tClass = 'eff-table'
      this.bodyOverflowX && (tClass += ' is-overflow-x')
      this.heights.bodyOverflowY && (tClass += ' is-overflow--y')
      this.border && (tClass += ' is-border')
      return tClass
    },
    rowStyle() {
      const style = {}
      style.minWidth = this.minWidth + 'px'
      style.height = this.rowHeight + 'px'
      const { leftWidth, rightWidth } = this
      if (this.bodyOverflowX) {
        style.maxWidth = this.bodyWidth + 'px'
        leftWidth && (style.paddingLeft = `${leftWidth}px`)
        rightWidth && (style.paddingRight = `${rightWidth}px`)
      }
      return style
    },
    scrollYwidth() {
      return this.heights.bodyOverflowY ? 17 : 0
    },
    isScrollRightEnd() {
      return this.bodyWrapperWidth + this.bodyScrollLeft > this.bodyWidth + this.scrollYwidth
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
    heights() {
      const { height, maxHeight, isScreenfull, data, rowHeight, headerRanked, headerLoad, bodyLoad } = this
      const { toolbar, header, footer } = this.$refs

      const tableHeight = isScreenfull ? window.screen.height : maxHeight || height || 400
      const toolbarHeight = toolbar ? rowHeight : 0
      const headerHeight = headerLoad && header ? rowHeight * headerRanked : 0
      const footerHeight = footer ? rowHeight : 0
      const bodyHeight = bodyLoad ? tableHeight - toolbarHeight - headerHeight - footerHeight : 0
      const bodyOverflowY = data.length > bodyHeight / rowHeight
      return {
        tableHeight,
        toolbarHeight,
        headerHeight,
        footerHeight,
        bodyHeight,
        bodyOverflowY
      }
    }
  },
  methods: {
    resize() {
      this.$nextTick(() => {
        this.bodyWrapperWidth = this.$el.getBoundingClientRect().width || this.minWidth
        this.overflowX()
        this.tableBody = this.$el.querySelector('.eff-table__body')
      })
    },
    overflowX() {
      const { minWidth, bodyWrapperWidth } = this
      this.bodyWidth = Math.max(bodyWrapperWidth, minWidth)
      this.bodyOverflowX = minWidth > bodyWrapperWidth - this.scrollYwidth
    },
    doLayout() {
      this.resize()
    }
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
