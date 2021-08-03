export default {
  data() {
    return {
      renderIndex: 0,
      columnRenderIndex: 0,
      columnRenderEndIndex: 0,
      fixedType: '',
      scrollLeft: 0,
      scrollTop: 0,
      bodyMarginTop: 0,
      bodyMarginLeft: 0,
      scrollLeftDir: null
    }
  },
  computed: {
    // 行虚拟滚动
    isVirtual() {
      const { tableData: { length }, renderSize, useExpand, useGroupColumn } = this
      return !useExpand && !useGroupColumn && length > 50 && length > renderSize
    },
    renderData() {
      const { isVirtual, tableData, renderIndex, renderSize } = this
      return isVirtual ? tableData.slice(renderIndex, renderSize + renderIndex) : tableData
    },
    renderSize() {
      const { heights: { bodyHeight }, rowHeight } = this
      return parseInt(bodyHeight / rowHeight + 6)
    },
    // 列虚拟滚动
    columnVisibleWidth() {
      const { bodyWrapperWidth, leftWidth, rightWidth, overflowY } = this
      return bodyWrapperWidth - leftWidth - rightWidth - (overflowY ? 17 : 0)
    },
    columnIsVirtual() {
      // return false
      const { useGroupColumn, useExpand, bodyWidth, leftWidth, rightWidth, columnVisibleWidth } = this
      return !useExpand && !useGroupColumn && bodyWidth - leftWidth - rightWidth > columnVisibleWidth + 400
    },
    renderColumn() {
      const { columnIsVirtual, bodyColumns, columnRenderIndex, columnRenderEndIndex } = this
      return columnIsVirtual && columnRenderEndIndex ? bodyColumns.slice(columnRenderIndex, columnRenderEndIndex) : bodyColumns
    },
    columnAccWidths() {
      return this.columnWidths.reduce((acc, cur) => {
        acc.num += cur
        acc.widths.push(acc.num)
        return acc
      }, { num: 0, widths: [] }).widths
    },
    dataAccHeight() {
      return this.tableData.reduce((acc, cur) => {
        acc.num += this.rowHeight
        acc.heights.push(acc.num)
        return acc
      }, { num: 0, heights: [] }).heights
    }
  },
  watch: {
    isVirtual(val) {
      if (!val) {
        this.renderIndex = 0
      }
    },
    scrollTop(scrollTop) {
      const { rowHeight } = this
      if (scrollTop < rowHeight) {
        this.renderIndex = 0
      }
      if (this.isVirtual) {
        this.renderIndex = this.dataAccHeight.findIndex(d => d > scrollTop)
      }
    },
    renderIndex(index) {
      this.bodyMarginTop = (index > 0 ? this.dataAccHeight[index - 1] : 0) + 'px'
    },
    columnIsVirtual(val) {
      if (val) {
        this.scrollLeftEvent()
      } else {
        this.bodyMarginLeft = ''
      }
    },
    scrollLeft(scrollLeft, oldScrollLeft) {
      const { columnIsVirtual, scrollLeftEvent } = this
      this.scrollLeftDir = scrollLeft > oldScrollLeft ? 'right' : 'left'
      if (columnIsVirtual) {
        scrollLeftEvent(scrollLeft)
      }
    },
    columnRenderIndex(startIndex) {
      this.bodyMarginLeft = (startIndex > 0 ? this.columnAccWidths[startIndex - 1] : 0) + 'px'
    }
  },
  mounted() {
    const { columnIsVirtual, scrollLeftEvent } = this
    columnIsVirtual && scrollLeftEvent()
  },
  methods: {
    scrollLeftEvent(scrollLeft = this.scrollLeft) {
      this.scrollLeft = scrollLeft
      const { columnIsVirtual, columnAccWidths, columnVisibleWidth } = this
      if (!columnIsVirtual || scrollLeft === 0) {
        this.columnRenderIndex = 0
        this.bodyMarginLeft = ''
        return
      }
      const startIndex = columnAccWidths.findIndex(d => d > scrollLeft)
      const findEndIndex = columnAccWidths.findIndex(d => d > columnAccWidths[startIndex] + columnVisibleWidth)
      const endIndex = findEndIndex > -1 ? findEndIndex + 2 : columnAccWidths.length
      this.columnRenderIndex = startIndex
      this.columnRenderEndIndex = endIndex
    },
    toScroll(rowIndex) {
      const { renderSize, rowHeight } = this
      if (rowIndex < renderSize / 2) {
        this.scrollTop = 0
      } else {
        this.$refs.body.$el.scrollTop = this.scrollTop = (rowIndex - renderSize / 2) * rowHeight
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
