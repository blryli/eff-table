export default {
  data() {
    return {
      renderIndex: 0,
      columnRenderIndex: 0,
      scrollIndex: 0,
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
    columnVisibleSize() {
      return this.bodyWrapperWidth - this.leftWidth - this.rightWidth - (this.overflowY ? 17 : 0)
    },
    columnIsVirtual() {
      return this.bodyWidth > this.bodyWrapperWidth + 200
    },
    columnRenderData() {
      const { bodyColumns, columnRenderIndex, getColumnEndRenderIndex } = this
      return this.columnIsVirtual ? bodyColumns.slice(columnRenderIndex, getColumnEndRenderIndex()) : bodyColumns
    },
    columnRenderSize() {
      return parseInt(this.bodyWidth / this.rowHeight + 4)
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
      bodyColumns.slice(columnRenderIndex).map(column => {
        let { width = 0 } = column
        !width && (width = spaceWidth)
        return Math.max(width, 40)
      })
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
