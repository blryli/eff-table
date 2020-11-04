export default {
  data() {
    return {
      scrollIndex: 0,
      renderIndex: 0,
      leftScrollIndex: 0,
      columnRenderIndex: 0,
      fixedType: '',
      scrollLeft: 0,
      scrollTop: 0,
      bodyMarginTop: 0,
      bodyMarginLeft: 0,
      preScrollLeft: 0
    }
  },
  computed: {
    // 行虚拟滚动
    isVirtual() {
      const len = this.tableData.length
      return len > 50 && len > this.renderSize
    },
    renderData() {
      return this.isVirtual ? this.tableData.slice(this.renderIndex, this.renderSize + this.renderIndex) : this.tableData
    },
    renderSize() {
      return parseInt(this.heights.bodyHeight / this.rowHeight + 6)
    },
    // 列虚拟滚动
    columnVisibleWidth() {
      return this.bodyWrapperWidth - this.leftWidth - this.rightWidth - (this.overflowY ? 17 : 0)
    },
    columnIsVirtual() {
      return this.bodyWidth - this.leftWidth - this.rightWidth > this.columnVisibleWidth + 600
    },
    renderColumn() {
      const { bodyColumns, columnRenderIndex, getColumnEndRenderIndex } = this
      return this.columnIsVirtual ? bodyColumns.slice(columnRenderIndex, getColumnEndRenderIndex()) : bodyColumns
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
      if (scrollTop < this.rowHeight) {
        this.scrollIndex = 0
      }
      if (this.isVirtual) {
        this.scrollIndex = parseInt(scrollTop / this.rowHeight)
      }
    },
    scrollIndex(scrollIndex, oldScrollIndex) {
      const { renderSize, scrollTop, rowHeight, tableData } = this
      const last = tableData.length - renderSize
      const offset = Math.abs(scrollIndex - this.renderIndex)

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
    scrollLeft(scrollLeft) {
      this.columnIsVirtual && this.scrollLeftEvent(scrollLeft)
    },
    columnIsVirtual(val) {
      if (val) {
        this.scrollLeftEvent()
      } else {
        this.leftScrollIndex = 0
        this.bodyMarginLeft = ''
      }
    }
  },
  mounted() {
    this.columnIsVirtual && this.scrollLeftEvent()
  },
  methods: {
    scrollLeftEvent(scrollLeft = 0) {
      if (!this.columnIsVirtual) {
        this.leftScrollIndex = 0
        this.bodyMarginLeft = ''
        return
      }
      let curWidth = 0
      for (let i = 0; i < this.columnWidths.length; i++) {
        const width = this.columnWidths[i]
        curWidth += width
        if (scrollLeft < curWidth) {
          this.leftScrollIndex = i
          break
        }
      }
      this.leftScrollIndexChange(this.leftScrollIndex)
    },
    leftScrollIndexChange(leftScrollIndex) {
      const { columnFirstIndex, columnLastIndex, scrollLeft, getWidth } = this
      const last = columnLastIndex - 3
      const offsetIndex = Math.abs(leftScrollIndex - this.columnRenderIndex)
      const offsetScroll = Math.abs(this.preScrollLeft - scrollLeft)

      if (leftScrollIndex <= 2) {
        this.columnRenderIndex = columnFirstIndex
        this.bodyMarginLeft = getWidth(0, columnFirstIndex) + 'px'
      } else if (leftScrollIndex >= last) {
        this.columnRenderIndex = last
        this.bodyMarginLeft = getWidth(0, last) + 'px'
      } else if (offsetScroll > 200 || offsetScroll > getWidth(leftScrollIndex, leftScrollIndex + 2) || offsetIndex > 1) {
        this.preScrollLeft = scrollLeft
        this.columnRenderIndex = leftScrollIndex
        this.bodyMarginLeft = getWidth(0, leftScrollIndex) + 'px'
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
        if (allWidth > this.columnVisibleWidth) {
          index = columnRenderIndex + i + 4
          if (index > len) {
            index = len
          }
          break
        }
      }
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
