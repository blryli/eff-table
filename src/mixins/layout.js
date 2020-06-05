import { on, off } from 'utils/dom'
export default {
  data() {
    return {
      tableWidth: 0,
      bodyWidth: 0,
      offset: 0,
      bodyOverflowX: false,
      bodyOverflowY: false,
      bodyScrollLeft: 0
    }
  },
  created() {
    on(window, 'resize', this.resize, { passive: true })
  },
  watch: {
    data(val) {
      this.resize()
    }
  },
  computed: {
    tableClass() {
      let tClass = 'eff-table'
      this.bodyOverflowX && (tClass += ' is-overflow-x')
      this.bodyOverflowY && (tClass += ' is-overflow-y')
      this.border && (tClass += ' is-border')
      return tClass
    },
    rowStyle() {
      const style = {}
      style.minWidth = this.minWidth + 'px'
      style.height = this.rowHeight + 'px'
      const { leftWidth, rightWidth } = this
      if (this.bodyOverflowX) {
        style.width = this.tableWidth + 'px'
        leftWidth && (style.paddingLeft = `${leftWidth}px`)
        rightWidth && (style.paddingRight = `${rightWidth}px`)
      }
      return style
    },
    scrollYwidth() {
      return this.bodyOverflowY ? 17 : 0
    },
    isScrollRightEnd() {
      return this.bodyWidth + this.bodyScrollLeft > this.tableWidth + this.scrollYwidth
    }
  },
  methods: {
    resize() {
      this.bodyWidth = this.$el.getBoundingClientRect().width
      const { minWidth } = this
      this.tableWidth = this.bodyWidth > minWidth ? this.bodyWidth : minWidth
      this.bodyHeightChange()
      this.$nextTick(() => {
        const { offsetWidth, scrollWidth } = this.$refs.header.$el
        this.bodyOverflowX = scrollWidth - 20 > offsetWidth
      })
    },
    bodyHeightChange() {
      this.$nextTick(() => {
        const body = this.$el.querySelector('.eff-table__body-wrapper')
        if (!body) return
        const { scrollHeight, clientHeight } = body
        this.bodyOverflowY = scrollHeight > clientHeight
      })
    }
  },
  mounted() {
    this.resize()
  },
  beforeDestroy() {
    off(window, 'resize', this.resize, { passive: true })
  }
}
