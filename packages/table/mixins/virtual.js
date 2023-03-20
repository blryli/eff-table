export default {
  data() {
    return {
      renderIndex: 0,
      columnRenderIndex: 0,
      columnRenderEndIndex: 0,
      scrollType: '',
      scrollLeft: 0,
      scrollTop: 0,
      bodyMarginTop: 0,
      bodyMarginLeft: 0,
      scrollList: {}
    }
  },
  computed: {
    // 行虚拟滚动
    isVirtual() {
      const { tableData: { length } = [], renderSize, useExpand, useGroupColumn, isSpanMethod, rowHeight } = this
      if (rowHeight === 'auto' || isSpanMethod || useExpand || useGroupColumn) return false
      return length > 30 && length > renderSize
    },
    renderData() {
      const { isVirtual, afterData, renderIndex, renderSize } = this
      return isVirtual ? afterData.slice(renderIndex, renderSize + renderIndex) : afterData
    },
    renderSize() {
      const { heights: { bodyHeight }, calcRowHeight } = this
      return parseInt(bodyHeight / calcRowHeight + 6)
    },
    // 列虚拟滚动
    columnVisibleWidth() {
      const { bodyWrapperWidth, scrollYwidth } = this
      return bodyWrapperWidth - scrollYwidth
    },
    columnIsVirtual() {
      // return false
      const { useGroupColumn, useExpand, bodyWidth, isSpanMethod, columnVisibleWidth } = this
      if (isSpanMethod || useExpand || useGroupColumn) return false
      return bodyWidth > columnVisibleWidth * 2
    },
    renderColumn() {
      const { columnIsVirtual, bodyColumns, columnRenderIndex, columnRenderEndIndex } = this
      return columnIsVirtual && columnRenderEndIndex ? bodyColumns.slice(columnRenderIndex, columnRenderEndIndex) : bodyColumns
    },
    columnAccWidths() {
      if (!this.columnIsVirtual) return
      return this.widths.columnWidths.reduce((acc, cur) => {
        acc.num += cur
        acc.widths.push(acc.num)
        return acc
      }, { num: 0, widths: [] }).widths
    },
    dataAccHeight() {
      if (!this.isVirtual) return
      return this.tableData.reduce((acc, cur) => {
        acc.num += this.calcRowHeight
        acc.heights.push(acc.num)
        return acc
      }, { num: 0, heights: [] }).heights
    }
  },
  watch: {
    isVirtual(val) {
      if (!val) {
        this.renderIndex = 0
        this.bodyMarginTop = ''
      }
    },
    columnIsVirtual(val) {
      if (!val) {
        this.columnRenderIndex = 0
        this.bodyMarginLeft = ''
      }
    }
  },
  beforeDestroy() {
    this.scrollList = null
  },
  methods: {
    handleScroll(scrollLeft = this.scrollLeft, scrollTop = this.scrollTop, fixed = '') {
      const { scrollList, isVirtual, columnIsVirtual, edit } = this
      const { calcRowHeight } = this
      // 同步滚动
      for (const key in scrollList) {
        if (key === fixed) continue
        const node = scrollList[key]
        if (!node) continue
        node.onscroll = null
        if (['', 'header', 'footer'].includes(key)) {
          node.scrollLeft = scrollLeft
        }
        if (['', 'left', 'right'].includes(key)) {
          node.scrollTop = scrollTop
          clearTimeout(node.timer)
          node.timer = setTimeout(() => {
            node.onscroll = node._onscroll
            clearTimeout(node.timer)
          }, 100)
        }
      }
      if (this.scrollTop !== scrollTop) {
        this.scrollTop = scrollTop
        // 纵向虚拟滚动
        if (isVirtual) {
          const index = this.dataAccHeight.findIndex(d => d > scrollTop)
          this.renderIndex = index
          this.bodyMarginTop = (index > 0 ? this.dataAccHeight[index - 1] : 0) + 'px'
          if (scrollTop < calcRowHeight) {
            this.renderIndex = 0
            this.bodyMarginTop = ''
          }
        }
      }
      if (this.scrollLeft !== scrollLeft) {
        this.scrollLeft = scrollLeft
        // 横向虚拟滚动
        if (columnIsVirtual) {
          const { columnAccWidths, columnVisibleWidth } = this
          const startIndex = columnAccWidths.findIndex(d => d > scrollLeft)
          const findEndIndex = columnAccWidths.findIndex(d => d > columnAccWidths[startIndex] + columnVisibleWidth)
          const endIndex = findEndIndex > -1 ? findEndIndex : columnAccWidths.length
          const columnRenderIndex = Math.max(startIndex - 2, 0)
          this.columnRenderIndex = columnRenderIndex
          this.columnRenderEndIndex = Math.min(endIndex + 2, columnAccWidths.length)
          this.bodyMarginLeft = (columnRenderIndex > 0 ? this.columnAccWidths[columnRenderIndex - 1] : 0) + 'px'
        }
        // 滚动中
        if (edit) {
          this.scrolling = true
          clearTimeout(timer)
          var timer = setTimeout(() => {
            this.scrolling = false
            clearTimeout(timer)
          }, 100)
        }
      }
    },
    toScroll(rowIndex) {
      const { renderSize, calcRowHeight } = this
      if (rowIndex < renderSize / 2) {
        this.scrollTop = 0
      } else {
        this.$refs.body.$el.scrollTop = this.scrollTop = (rowIndex - renderSize / 2) * calcRowHeight
      }
      return this.$nextTick()
    },
    // 清除滚动位置
    clearScroll() {
      this.scrollLeft = 0
      this.scrollTop = 0
      return this.$nextTick()
    }
  }
}
