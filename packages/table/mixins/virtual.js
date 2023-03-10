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
      const { tableData: { length } = [], renderSize, useExpand, useGroupColumn, isSpanMethod, rowHeight } = this
      if (rowHeight === 'auto' || isSpanMethod || useExpand || useGroupColumn) return
      return length > 30 && length > renderSize
    },
    renderData() {
      const { isVirtual, afterData, renderIndex, renderSize } = this
      return isVirtual ? afterData.slice(renderIndex, renderSize + renderIndex) : afterData
    },
    renderSize() {
      const { heights: { bodyHeight }, _rowHeight } = this
      return parseInt(bodyHeight / _rowHeight + 6)
    },
    // 列虚拟滚动
    columnVisibleWidth() {
      const { bodyWrapperWidth, overflowY } = this
      return bodyWrapperWidth - (overflowY ? 17 : 0)
    },
    columnIsVirtual() {
      // return false
      const { tableData, useGroupColumn, useExpand, bodyWidth, isSpanMethod, columnVisibleWidth } = this
      return !isSpanMethod && tableData && tableData.length && !useExpand && !useGroupColumn && bodyWidth > columnVisibleWidth + 200
    },
    renderColumn() {
      const { columnIsVirtual, bodyColumns, columnRenderIndex, columnRenderEndIndex } = this
      return columnIsVirtual && columnRenderEndIndex ? bodyColumns.slice(columnRenderIndex, columnRenderEndIndex) : bodyColumns
    },
    columnAccWidths() {
      if (!this.isVirtual) return
      return this.columnWidths.reduce((acc, cur) => {
        acc.num += cur
        acc.widths.push(acc.num)
        return acc
      }, { num: 0, widths: [] }).widths
    },
    dataAccHeight() {
      if (!this.isVirtual) return
      return this.tableData.reduce((acc, cur) => {
        acc.num += this._rowHeight
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
      const { _rowHeight } = this
      if (scrollTop < _rowHeight) {
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
    this.$nextTick(() => {
      const { columnIsVirtual, scrollLeftEvent } = this
      columnIsVirtual && scrollLeftEvent()
    })
  },
  methods: {
    scrollLeftEvent(scrollLeft = this.scrollLeft) {
      if (!this.isVirtual) return
      if (!(this.tableData || []).length) return
      this.scrollLeft = scrollLeft
      const { columnIsVirtual, columnAccWidths, columnVisibleWidth } = this
      if (!columnIsVirtual) {
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
      const { renderSize, _rowHeight } = this
      if (rowIndex < renderSize / 2) {
        this.scrollTop = 0
      } else {
        this.$refs.body.$el.scrollTop = this.scrollTop = (rowIndex - renderSize / 2) * _rowHeight
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
