export default {
  data() {
    return {
      renderIndex: 0,
      scrollIndex: 0,
      bodyMarginTop: 0
    }
  },
  computed: {
    isVirtual() {
      return this.tableData.length > this.pageSize
    },
    renderData() {
      return this.isVirtual ? this.tableData.slice(this.renderIndex, this.pageSize + this.renderIndex) : this.tableData
    },
    pageSize() {
      return parseInt(this.heights.bodyHeight / this.rowHeight + 8)
    }
  },
  watch: {
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
    scrollIndex(val) {
      const { pageSize, scrollTop, rowHeight, tableData } = this
      const last = tableData.length - pageSize
      val > last - 2 && (val = last)
      const offset = Math.abs(val - this.renderIndex)

      if (val < 2) {
        this.renderIndex = 0
        this.bodyMarginTop = 0
      } else if (offset > 1) {
        this.renderIndex = val
        const top = val === 2 ? rowHeight : rowHeight * 4
        if (scrollTop > top) {
          this.bodyMarginTop = scrollTop - top + 'px'
        }
      }
      if (val === last - 1) {
        this.bodyMarginTop = scrollTop - rowHeight + 'px'
        this.renderIndex = last - 1
      }
      if (val === last) {
        this.bodyMarginTop = this.tableData.length * rowHeight - pageSize * rowHeight + 'px'
        this.renderIndex = last
      }
    }
  },
  methods: {
    toScroll(rowIndex, cb) {
      setTimeout(() => {
        const { pageSize, rowHeight } = this
        if (rowIndex < pageSize / 2) {
          this.scrollTop = 0
        } else {
          this.scrollTop = (rowIndex - pageSize / 2) * rowHeight
        }
        setTimeout(() => {
          cb && cb()
        }, 100)
      })
    }
  }
}
