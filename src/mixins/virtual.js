export default {
  data() {
    return {
      renderIndex: 0,
      scrollIndex: 0,
      xScrollIndex: 0,
      columnRenderIndex: 0,
      bodyMarginTop: 0,
      fixedType: '',
      scrollLeft: 0,
      scrollTop: 0
    }
  },
  computed: {
    isVirtual() {
      const len = this.tableData.length
      return len > 50 && len > this.renderSize
    },
    renderData() {
      return this.isVirtual ? this.tableData.slice(this.renderIndex, this.renderSize + this.renderIndex) : this.tableData
    },
    renderSize() {
      return parseInt(this.heights.bodyHeight / this.rowHeight + 4)
    },
    columnVisibleWidth() {
      return this.bodyWrapperWidth - this.leftWidth - this.rightWidth - (this.overflowY ? 17 : 0)
    },
    columnIsVirtual() {
      return this.bodyWidth - this.leftWidth - this.rightWidth > this.columnVisibleWidth + 200
    },
    renderColumn() {
      const { bodyColumns, columnRenderIndex, getColumnEndRenderIndex } = this
      return this.columnIsVirtual ? bodyColumns.slice(columnRenderIndex, getColumnEndRenderIndex()) : bodyColumns
    },
    columnRenderSize() {
      return parseInt(this.bodyWidth / this.rowHeight + 4)
    },
    bodyMarginLeft() {
      return this.columnWidths.slice(0, this.columnRenderIndex).reduce((acc, cur) => acc + cur, 0) + 'px'
    }
  },
  watch: {
    bodyColumns() {
      this.setColumnRenderIndex()
    },
    isVirtual(val) {
      if (!val) {
        this.renderIndex = 0
        this.bodyMarginTop = 0
      }
    },
    scrollTop(scrollTop) {
      if (scrollTop < this.rowHeight) {
        this.bodyMarginTop = 0
        this.renderIndex = 0
      }
      if (this.isVirtual) {
        this.scrollIndex = parseInt(scrollTop / this.rowHeight)
      }
    },
    scrollLeft(scrollLeft) {
      if (scrollLeft < this.columnWidths[0]) {
        this.xScrollIndex = 0
        return
      }
      if (this.columnIsVirtual) {
        let curWidth = 0
        console.log(this.columnWidths.slice(this.columnRenderIndex).reduce((acc, cur) => acc + cur, 0), this.columnVisibleWidth)
        if (this.columnWidths.slice(this.columnRenderIndex).reduce((acc, cur) => acc + cur, 0) < this.columnVisibleWidth) {
          return
        }
        for (let i = 0; i < this.columnWidths.length; i++) {
          const width = this.columnWidths[i]
          curWidth += width
          if (scrollLeft < curWidth && i % 2 === 0) {
            this.columnRenderIndex = i
            break
          }
        }
      }
    },
    scrollIndex(scrollIndex) {
      const { renderSize, scrollTop, rowHeight, tableData } = this
      const last = tableData.length - renderSize
      scrollIndex > last - 2 && (scrollIndex = last)
      const offset = Math.abs(scrollIndex - this.renderIndex)

      if (scrollIndex < 2) {
        this.renderIndex = 0
        this.bodyMarginTop = 0
      } else if (offset > 1) {
        this.renderIndex = scrollIndex
        const offsetTop = scrollIndex === 2 ? rowHeight : rowHeight * 2
        if (scrollTop > offsetTop) {
          this.bodyMarginTop = scrollTop - offsetTop + 'px'
        }
      }
      if (scrollIndex === last - 1) {
        this.bodyMarginTop = scrollTop - rowHeight + 'px'
        this.renderIndex = last - 1
      }
      if (scrollIndex === last) {
        this.bodyMarginTop = this.tableData.length * rowHeight - renderSize * rowHeight + 'px'
        this.renderIndex = last
      }
    }
  },
  mounted() {
    this.setColumnRenderIndex()
  },
  methods: {
    getColumnEndRenderIndex() {
      const { bodyColumns, columnRenderIndex, spaceWidth } = this
      const columns = bodyColumns.slice(columnRenderIndex)
      let index = 0
      let allWidth = 0
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]
        let { width = 0 } = column
        !width && (width = spaceWidth)
        const columnWidth = Math.max(width, 40)
        allWidth += columnWidth
        if (allWidth > this.columnVisibleWidth) {
          index = i + 5
          break
        }
      }
      return index
    },
    setColumnRenderIndex() {
      const leftFixed = this.bodyColumns.filter(d => d.fixed).length
      this.columnRenderIndex = leftFixed ? leftFixed - 1 : 0
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
