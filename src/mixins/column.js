export default {
  created() {
    this.$on('insert.column', this.insertColumn)
    this.$on('remove.column', this.removeColumn)
  },
  computed: {
    columnsWidth() {
      return this.columns.reduce((acc, cur) => acc.concat(cur.width), [])
    },
    leftWidth() {
      return this.columns.reduce((acc, cur) => cur.fixed === 'left' ? acc + cur.width : acc, 0)
    },
    rightWidth() {
      return this.columns.reduce((acc, cur) => cur.fixed === 'right' ? acc + cur.width : acc, 0)
    },
    minWidth() {
      return this.columns.reduce((acc, cur) => cur.show !== false ? acc + cur.width : acc, 0)
    },
    spaceWidth() {
      const spaceNode = this.columns.filter(d => !d.width).length
      return spaceNode ? (this.bodyWidth - this.minWidth - (this.bodyOverflowY ? 20 : 0)) / spaceNode : 0
    },
    showSpace() {
      const { minWidth, bodyWidth, spaceWidth } = this
      return minWidth + spaceWidth < bodyWidth - 20
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
    setColumnStyle(column, columnIndex, width) {
      const style = {}
      style.minWidth = width + 'px'
      style.maxWidth = width + 'px'

      // 如果有横向滚动条 设置左右定位元素的位置
      if (this.bodyOverflowX) {
        column.fixed === 'left' && (style.left = (columnIndex ? this.columnsWidth[columnIndex - 1] : 0) + this.bodyScrollLeft + 'px')

        if (!this.isScrollRightEnd) {
          const firstRightFixedIndex = this.columns.findIndex(d => d.fixed === 'right')
          columnIndex === firstRightFixedIndex && (style.borderLeftColor = 'transparent')
        }

        column.fixed === 'right' && (style.right = (columnIndex !== this.columnsWidth.length - 1 ? this.columnsWidth[columnIndex + 1] : 0) + (this.tableWidth - this.bodyWidth) - this.bodyScrollLeft + this.scrollYwidth + 2 + 'px')
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
