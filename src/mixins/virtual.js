export default {
  data() {
    return {
      renderIndex: 0,
      scrollIndex: 0,
      bodyMarginTop: 0,
      fixedType: '',
      scrollLeft: 0,
      scrollTop: 0
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
      return parseInt(this.heights.bodyHeight / this.rowHeight + 4)
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
    scrollIndex(scrollIndex) {
      const { pageSize, scrollTop, rowHeight, tableData } = this
      const last = tableData.length - pageSize
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
