import { on, off } from 'utils/dom'
export default {
  data() {
    return {
      bodyWidth: 0,
      bodyWrapperWidth: 0,
      offset: 0,
      bodyOverflowX: false,
      bodyOverflowY: false,
      overflowYHeight: 0,
      bodyScrollLeft: 0
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
      this.bodyOverflowY && (tClass += ' is-overflow--y')
      this.border && (tClass += ' is-border')
      return tClass
    },
    rowStyle() {
      const style = {}
      style.minWidth = this.minWidth + 'px'
      style.height = this.rowHeight + 'px'
      const { leftWidth, rightWidth } = this
      if (this.bodyOverflowX) {
        style.width = this.bodyWidth + 'px'
        leftWidth && (style.paddingLeft = `${leftWidth}px`)
        rightWidth && (style.paddingRight = `${rightWidth}px`)
      }
      return style
    },
    scrollYwidth() {
      return this.bodyOverflowY ? 17 : 0
    },
    isScrollRightEnd() {
      return this.bodyWrapperWidth + this.bodyScrollLeft > this.bodyWidth + this.scrollYwidth
    }
  },
  methods: {
    resize() {
      this.bodyWrapperWidth = this.$el.getBoundingClientRect().width
      const { minWidth, bodyWrapperWidth } = this
      this.bodyWidth = this.bodyWrapperWidth > minWidth ? this.bodyWrapperWidth : minWidth
      this.bodyHeightChange()
      this.$nextTick(() => {
        this.bodyOverflowX = minWidth > bodyWrapperWidth - this.scrollYwidth
        this.tableBody = this.$refs.tableBody
      })
    },
    bodyHeightChange() {
      this.$nextTick(() => {
        const body = this.$el.querySelector('.eff-table__body-wrapper')
        if (!body) return
        const { scrollHeight, clientHeight } = body
        this.overflowYHeight = scrollHeight - clientHeight
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
