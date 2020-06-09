export default {
  created() {
    this.$on('insert.column', this.insertColumn)
    this.$on('remove.column', this.removeColumn)
  },
  computed: {
    columnsWidth() {
      return this.visibleColumns.reduce((acc, cur) => acc.concat(cur.width), [])
    },
    leftWidth() {
      return this.visibleColumns.reduce((acc, cur) => cur.fixed === 'left' ? acc + cur.width : acc, 0)
    },
    rightWidth() {
      return this.visibleColumns.reduce((acc, cur) => cur.fixed === 'right' ? acc + cur.width : acc, 0)
    },
    minWidth() {
      return this.visibleColumns.reduce((acc, cur) => cur.show !== false ? acc + cur.width : acc, 0)
    },
    spaceNum() {
      return this.visibleColumns.filter(d => !d.width).length
    },
    spaceWidth() {
      const { spaceNum } = this
      return spaceNum ? (this.bodyWidth - (spaceNum === 1 ? 2 : 2.5) - this.minWidth - (this.bodyOverflowY ? 20 : 0)) / spaceNum : 0
    },
    showSpace() {
      const { minWidth, bodyWidth, spaceWidth, spaceNum } = this
      return minWidth + spaceWidth * (spaceNum || 1) < bodyWidth - (spaceNum === 1 ? 2 : 2.5) - (this.bodyOverflowY ? 20 : 0)
    }
  },
  watch: {
    columns(columns) {

    }
  },
  mounted() {
    this.$nextTick(() => {
      this.isLoad = true
    })
  },
  methods: {
    setColumnStyle(column, colIndex, width) {
      const style = {}
      style.minWidth = width + 'px'
      style.maxWidth = width + 'px'

      // 如果有横向滚动条 设置左右定位元素的位置
      if (this.bodyOverflowX) {
        column.fixed === 'left' && (style.left = (colIndex ? this.columnsWidth[colIndex - 1] : 0) + this.bodyScrollLeft + 'px')

        if (!this.isScrollRightEnd) {
          const firstRightFixedIndex = this.columns.findIndex(d => d.fixed === 'right')
          colIndex === firstRightFixedIndex && (style.borderLeftColor = 'transparent')
        }

        column.fixed === 'right' && (style.right = (colIndex !== this.columnsWidth.length - 1 ? this.columnsWidth[colIndex + 1] : 0) + (this.tableWidth - this.bodyWidth) - this.bodyScrollLeft + this.scrollYwidth + 2 + 'px')
      }
      return style
    },
    exchange(parant, node1, node2) {
      var createNode1 = document.createElement('div')
      var createNode2 = document.createElement('div')
      parant.insertBefore(createNode1, node1)
      parant.insertBefore(createNode2, node2)
      parant.replaceChild(node1, createNode2)
      parant.replaceChild(node2, createNode1)
    }
  },
  beforeDestroy() {
    this.$off('insert.column', this.headerColumn)
    this.$off('remove.column', this.removeColumn)
  }
}
