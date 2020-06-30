export default {
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
      return this.visibleColumns.reduce((acc, cur) => acc + cur.width, 0)
    },
    spaceNum() {
      return this.visibleColumns.filter(d => !d.width).length
    },
    spaceWidth() {
      const { spaceNum } = this
      return spaceNum ? (this.bodyWrapperWidth - (spaceNum === 1 ? 2 : 2.5) - this.minWidth - this.scrollYwidth) / spaceNum : 0
    },
    showSpace() {
      const { minWidth, bodyWrapperWidth, spaceWidth, spaceNum } = this
      return minWidth + spaceWidth * (spaceNum || 1) < bodyWrapperWidth - (spaceNum === 1 ? 2 : 2.5) - this.scrollYwidth
    }
  },
  methods: {
    setColumnStyle(column, columnIndex, width) {
      const style = {}
      style.minWidth = width + 'px'
      style.maxWidth = width + 'px'

      const { bodyOverflowX, columnsWidth, isScrollRightEnd, bodyWidth, bodyWrapperWidth, bodyScrollLeft } = this

      // 如果有横向滚动条 设置左右定位元素的位置
      if (column.fixed === 'left' && bodyOverflowX) {
        column.fixed === 'left' && (style.left = (columnIndex ? columnsWidth[columnIndex - 1] : 0) + bodyScrollLeft + 'px')
      }

      if (column.fixed === 'right') {
        if (bodyOverflowX) {
          if (!isScrollRightEnd) {
            const firstRightFixedIndex = this.visibleColumns.findIndex(d => d.fixed === 'right')
            columnIndex === firstRightFixedIndex && (style.borderLeftColor = 'transparent')
          }
        }
        if (bodyScrollLeft - 40 > bodyWidth - bodyWrapperWidth) {
          style.right = 0
        } else {
          style.right = (columnIndex !== columnsWidth.length - 1 ? columnsWidth[columnIndex + 1] : 0) + (bodyWidth - bodyWrapperWidth) - bodyScrollLeft + (bodyOverflowX ? this.scrollYwidth + 2 : 0) + 'px'
        }
      }
      return style
    }
  }
}
