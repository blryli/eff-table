import { on, off } from '../utils/dom'
import { ref, watch, computed, nextTick } from 'vue'
export default {
  setup(props) {
    on(window, 'resize', this.resize, { passive: true })
    const bodyWidth = ref(0)
    const bodyWrapperWidth = ref(0)
    const isScreenfull = ref(false)
    const offset = ref(0)
    const overflowX = ref(false)
    const headerLoad = ref(false)
    const bodyLoad = ref(false)

    const tableClass = computed(() => {
      let tClass = 'eff-table__container'
      const { overflowX, overflowY, border } = this
      overflowX && (tClass += ' is-overflow--x')
      overflowY && (tClass += ' is-overflow--y')
      border && (tClass += ' is-border')
      return tClass
    })
    const tableStyle = computed(() => {
      const style = {}
      const { isScreenfull, height, maxHeight } = this
      const screenHeight = window.screen.height
      style['--rowHeight'] = this.rowHeight + 'px'
      if (isScreenfull) {
        style.height = screenHeight + 'px'
      } else {
        if (height) style.height = height + 'px'
        if (maxHeight) style.maxHeight = maxHeight + 'px'
        if (!height && !maxHeight) style.maxHeight = screenHeight + 'px'
      }
      return style
    })
    const bodyRenderWidth = computed(() => {
      const { columnIsVirtual, columnWidths, columnRenderIndex, columnRenderEndIndex, bodyWidth } = this
      return columnIsVirtual ? columnWidths.slice(columnRenderIndex, columnRenderEndIndex).reduce((acc, cur) => acc + cur, 0) : bodyWidth
    })
    const fixedHeight = computed(() => {
      const { showSummary, heights, overflowX } = this
      if (showSummary) {
        return ''
      }
      const { headerHeight, bodyHeight, searchHeight } = heights
      let height = headerHeight + bodyHeight + searchHeight
      overflowX && (height -= 17)
      return height + 'px'
    })
    const scrollYwidth = computed(() => {
      return this.overflowY ? 17 : 0
    })
    const isScrollRightEnd = computed(() => {
      const { bodyWrapperWidth, scrollLeft, bodyWidth, scrollYwidth } = this
      return bodyWrapperWidth + scrollLeft > bodyWidth + scrollYwidth
    })
    const getDeepth = (array) => {
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
    const headerRanked = computed(() => {
      return getDeepth(this.visibleColumns)
    })
    const overflowY = computed(() => {
      const { bodyHeight, maxHeight, dataHeight } = this.heights
      const overflowXHeight = (this.overflowX ? 17 : 0)
      return bodyHeight && (maxHeight ? dataHeight > maxHeight : dataHeight > bodyHeight - overflowXHeight)
    })
    const bodyRect = computed(() => {
      const { columnIsVirtual, bodyWrapper } = this
      if (!columnIsVirtual || !bodyWrapper) return {}
      const { left, right } = bodyWrapper.getBoundingClientRect()
      const { leftWidth, rightWidth } = this
      return { bodyLeft: left + leftWidth, bodyRight: right + rightWidth }
    })
    const heights = computed(() => {
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
    })

    const setOverflowX = () => {
      const { minWidth, bodyWrapperWidth, scrollYwidth } = this
      this.bodyWidth = Math.max(bodyWrapperWidth - 2, minWidth) - scrollYwidth
      this.overflowX = minWidth > (bodyWrapperWidth - 2 - scrollYwidth)
    }
    const resize = () => {
      nextTick(() => {
        const { $el, minWidth, setOverflowX, scrollLeftEvent } = this
        console.log(this.$el)
        console.log(this)
        console.log(this.$refs)
        this.bodyWrapper = this.$refs.body.$el
        this.bodyWrapperWidth = $el.getBoundingClientRect().width || minWidth
        setOverflowX()
        scrollLeftEvent()
        this.tableBody = $el.querySelector('.eff-table__body')
      })
    }

    const doLayout = () => {
      resize()
    }

    watch(isScreenfull, () => {
      setTimeout(() => {
        resize()
      }, 0)
    })

    return {
      bodyWidth,
      bodyWrapperWidth,
      isScreenfull,
      offset,
      overflowX,
      headerLoad,
      bodyLoad,
      tableClass,
      tableStyle,
      bodyRenderWidth,
      fixedHeight,
      scrollYwidth,
      isScrollRightEnd,
      headerRanked,
      overflowY,
      bodyRect,
      heights,
      resize,
      setOverflowX,
      doLayout
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
  beforeUnmount() {
    off(window, 'resize', this.resize, { passive: true })
    clearTimeout(this.timer)
  }
}
