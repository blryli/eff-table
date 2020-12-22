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
      const { tableData: { length }, renderSize } = this
      return length > 50 && length > renderSize
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
      const { bodyWidth, leftWidth, rightWidth, columnVisibleWidth } = this
      return bodyWidth - leftWidth - rightWidth > columnVisibleWidth + 500
    },
    renderColumn() {
      const { columnIsVirtual, bodyColumns, columnRenderIndex, getColumnEndRenderIndex } = this
      return columnIsVirtual ? bodyColumns.slice(columnRenderIndex, getColumnEndRenderIndex()) : bodyColumns
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
      const { columnIsVirtual, bodyRect, columnLastIndex, columnWidths, getWidth } = this
      if (!columnIsVirtual || scrollLeft === 0) {
        this.columnRenderIndex = 0
        this.bodyMarginLeft = ''
        return
      }
      let leftScrollIndex = 0
      let curWidth = 0
      for (let i = 0; i < columnWidths.length; i++) {
        const width = columnWidths[i]
        curWidth += width
        if (scrollLeft < curWidth) {
          leftScrollIndex = i
          break
        }
      }
      const rowRect = document.querySelector('.eff-table__body-row').getBoundingClientRect()
      const { left, right } = rowRect
      const { bodyLeft, bodyRight } = bodyRect
      if (right < bodyRight) {
        this.columnRenderIndex += 2
        this.bodyMarginLeft = getWidth(0, this.columnRenderIndex) + 'px'
      } else if (left > bodyLeft) {
        this.columnRenderIndex -= 2
        this.bodyMarginLeft = getWidth(0, this.columnRenderIndex) + 'px'
      }

      const offsetIndex = Math.abs(leftScrollIndex - this.columnRenderIndex)
      if (offsetIndex > 2) {
        this.columnRenderIndex = leftScrollIndex - 1
        this.bodyMarginLeft = getWidth(0, leftScrollIndex - 1) + 'px'
      }

      const last = columnLastIndex - 3
      if (this.columnRenderIndex > last) {
        this.columnRenderIndex = last
        this.bodyMarginLeft = getWidth(0, this.columnRenderIndex) + 'px'
      }
    },
    getWidth(start, end) {
      return this.columnWidths.slice(start, end).reduce((acc, cur) => acc + cur, 0)
    },
    getColumnEndRenderIndex() {
      const { columnRenderIndex, spaceWidth } = this
      const bodyColumns = [...this.bodyColumns]

      const columns = bodyColumns.slice(columnRenderIndex)
      const len = this.bodyColumns.length
      let index = 0
      let allWidth = 0
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]
        let { width = 0 } = column
        !width && (width = spaceWidth)
        const columnWidth = Math.max(width, 40)
        allWidth += columnWidth
        console.log()
        if (allWidth > this.columnVisibleWidth + 400) {
          index = columnRenderIndex + i + 2
          break
        } else if (columnRenderIndex + i >= len - 1) {
          index = len
          break
        }
      }
      this.columnRenderEndIndex = index
      return index
    },
    toScroll(rowIndex) {
      const { renderSize, rowHeight } = this
      if (rowIndex < renderSize / 2) {
        this.scrollTop = 0
      } else {
        this.$refs.body.$el.scrollTop = this.scrollTop = (rowIndex - renderSize / 2) * rowHeight
      }
      return this.$nextTick()
    }
  }
}
