export default {
  computed: {
    columnWidths() {
      const { bodyColumns, spaceWidth } = this
      return bodyColumns.reduce((acc, cur) => acc.concat(Math.max(cur.width || spaceWidth, 40)), [])
    },
    allMinWidth() {
      return this.columnWidths.reduce((acc, cur) => acc + cur, 0)
    },
    leftWidth() {
      const { bodyColumns, spaceWidth } = this
      return bodyColumns.reduce((acc, cur) => cur.fixed === 'left' ? acc + Math.max(cur.width || spaceWidth, 40) : acc, 0)
    },
    rightWidth() {
      const { bodyColumns, spaceWidth } = this
      return bodyColumns.reduce((acc, cur) => cur.fixed === 'right' ? acc + Math.max(cur.width || spaceWidth, 40) : acc, 0)
    },
    minWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.width ? acc + Math.max(cur.width, 40) : acc, 0)
    },
    spaceNum() {
      return this.bodyColumns.filter(d => !d.width).length
    },
    spaceWidth() {
      const { spaceNum, bodyWrapperWidth, minWidth, scrollYwidth } = this
      if (minWidth > bodyWrapperWidth) return 0
      return spaceNum ? (bodyWrapperWidth - 2 - minWidth - scrollYwidth) / spaceNum : 0
    },
    showSpace() {
      const { minWidth, bodyWrapperWidth, spaceWidth, spaceNum, scrollYwidth } = this
      return minWidth + spaceWidth * (spaceNum || 1) < bodyWrapperWidth - 2 - scrollYwidth
    }
  }
}
