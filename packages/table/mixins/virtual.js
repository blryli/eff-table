export default {
  data() {
    return {
      scrollIndex: 0,
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
      return columnIsVirtual ? bodyColumns.slice(columnRenderIndex, columnRenderEndIndex) : bodyColumns
    },
    columnFirstIndex() {
      return this.bodyColumns.filter(d => d.fixed === 'left').length
    },
    columnLastIndex() {
      const columnWidths = [...this.columnWidths]
      const columnLastIndex = columnWidths.findIndex((d, i) => columnWidths.slice(i).reduce((acc, cur) => acc + +cur, 0) <= this.columnVisibleWidth)
      return columnLastIndex
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
        this.scrollIndex = 0
      }
      if (this.isVirtual) {
        this.scrollIndex = parseInt(scrollTop / rowHeight)
      }
    },
    scrollIndex(scrollIndex, oldScrollIndex) {
      const { renderSize, scrollTop, rowHeight, tableData, renderIndex } = this
      const last = tableData.length - renderSize
      const offset = Math.abs(scrollIndex - renderIndex)

      if (scrollIndex < 2) {
        this.renderIndex = 0
        this.bodyMarginTop = 0
      } else if (scrollIndex > last - 2) {
        this.bodyMarginTop = last * rowHeight + 'px'
        this.renderIndex = last
      } else if (offset > 2 || Math.abs(scrollIndex - oldScrollIndex) > 3) {
        this.renderIndex = scrollIndex
        const offsetTop = scrollIndex === 2 ? rowHeight : rowHeight * 3
        this.bodyMarginTop = scrollTop - offsetTop + 'px'
      }
    },
    scrollLeft(scrollLeft, oldScrollLeft) {
      const { columnIsVirtual, scrollLeftEvent } = this
      this.scrollLeftDir = scrollLeft > oldScrollLeft ? 'right' : 'left'
      columnIsVirtual && scrollLeftEvent(scrollLeft)
    },
    columnIsVirtual(val) {
      if (val) {
        this.scrollLeftEvent()
      } else {
        this.bodyMarginLeft = ''
      }
    }
  },
  mounted() {
    const { columnIsVirtual, scrollLeftEvent } = this
    columnIsVirtual && scrollLeftEvent()
  },
  methods: {
    scrollLeftEvent(scrollLeft = this.scrollLeft) {
      this.scrollLeft = scrollLeft
      const { columnIsVirtual, columnWidths, getWidth } = this
      if (!columnIsVirtual || scrollLeft === 0) {
        this.columnRenderIndex = 0
        this.bodyMarginLeft = ''
        return
      }
      let startIndex = 0
      let endIndex = 0
      let curWidth = 0
      let allWidth = 0
      for (let i = 0; i < columnWidths.length; i++) {
        const width = columnWidths[i]
        curWidth += width
        if (scrollLeft < curWidth) {
          startIndex = i
          break
        }
      }
      for (let i = 0; i < columnWidths.length; i++) {
        const width = columnWidths[i]
        allWidth += width
        if (allWidth > this.columnVisibleWidth + 200) {
          endIndex = startIndex + i + 3
          break
        }
      }
      this.columnRenderIndex = startIndex
      this.columnRenderEndIndex = endIndex
      this.bodyMarginLeft = getWidth(0, this.columnRenderIndex) + 'px'
    },
    getWidth(start, end) {
      return this.columnWidths.slice(start, end).reduce((acc, cur) => acc + cur, 0)
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
