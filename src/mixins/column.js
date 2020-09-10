export default {
  computed: {
    columnsWidth() {
      return this.bodyColumns.reduce((acc, cur) => acc.concat(cur.width || this.spaceWidth), [])
    },
    leftWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.fixed === 'left' ? acc + (cur.width || this.spaceWidth) : acc, 0)
    },
    rightWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.fixed === 'right' ? acc + (cur.width || this.spaceWidth) : acc, 0)
    },
    minWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.width ? acc + cur.width : acc, 0)
    },
    spaceNum() {
      return this.bodyColumns.filter(d => !d.width).length
    },
    spaceWidth() {
      const { spaceNum, bodyWrapperWidth, minWidth, scrollYwidth } = this
      return spaceNum ? (bodyWrapperWidth - (spaceNum === 1 ? 2 : 2.5) - minWidth - scrollYwidth) / spaceNum : 0
    },
    showSpace() {
      const { minWidth, bodyWrapperWidth, spaceWidth, spaceNum } = this
      return minWidth + spaceWidth * (spaceNum || 1) < bodyWrapperWidth - (spaceNum === 1 ? 2 : 2.5) - this.scrollYwidth
    }
  },
  methods: {
    setColumnStyle(column, columnIndex) {
      const style = {}
      let { width = 0 } = column
      const { spaceWidth } = this
      !width && (width = spaceWidth)
      const columnWidth = Math.max(width, 40)
      style.minWidth = columnWidth + 'px'
      style.maxWidth = columnWidth + 'px'

      if (columnIndex === 0) {
        style.borderLeft = 0
      }

      const { bodyOverflowX, columnsWidth, isScrollRightEnd, bodyWidth, bodyWrapperWidth, bodyScrollLeft } = this

      // 如果有横向滚动条 设置左右定位元素的位置
      if (column.fixed === 'left' && bodyOverflowX) {
        column.fixed === 'left' && (style.left = (columnIndex ? columnsWidth[columnIndex - 1] : 0) + bodyScrollLeft + 'px')
      }

      if (column.fixed === 'right') {
        if (bodyOverflowX) {
          if (!isScrollRightEnd) {
            const firstRightFixedIndex = this.bodyColumns.findIndex(d => d.fixed === 'right')
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
