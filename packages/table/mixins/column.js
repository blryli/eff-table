export default {
  computed: {
    columnWidths() {
      const { bodyColumns, spaceWidth } = this
      return bodyColumns.reduce((acc, cur) => acc.concat(Math.max(cur.width || Math.max(spaceWidth, cur.minWidth || 40), 40)), [])
    },
    allMinWidth() {
      return this.columnWidths.reduce((acc, cur) => acc + cur, 0)
    },
    leftWidth() {
      const { bodyColumns, spaceWidth } = this
      return bodyColumns.reduce((acc, cur) => cur.fixed === 'left' ? acc + Math.max(cur.width || Math.max(spaceWidth, cur.minWidth || 40), 40) : acc, 0)
    },
    rightWidth() {
      const { bodyColumns, spaceWidth } = this
      return bodyColumns.reduce((acc, cur) => cur.fixed === 'right' ? acc + Math.max(cur.width || Math.max(spaceWidth, cur.minWidth || 40), 40) : acc, 0)
    },
    minWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.width ? acc + Math.max(cur.width || cur.minWidth || 40, 40) : acc, 0)
    },
    spaceNum() {
      return this.bodyColumns.filter(d => !d.width && !d.minWidth).length
    },
    minWidths() {
      return this.bodyColumns.reduce((acc, cur) => cur.minWidth ? acc + cur.minWidth : acc, 0)
    },
    spaceWidth() {
      const { spaceNum, bodyWrapperWidth, minWidth, scrollYwidth, minWidths } = this
      if (minWidth > bodyWrapperWidth) return 0
      const spaceWidth = spaceNum ? (bodyWrapperWidth - 2 - minWidth - scrollYwidth - minWidths) / spaceNum : 0
      return spaceWidth
    },
    showSpace() {
      const { minWidth, bodyWrapperWidth, spaceWidth, spaceNum, scrollYwidth } = this
      return minWidth + spaceWidth * (spaceNum || 1) < bodyWrapperWidth - 2 - scrollYwidth
    }
  }
}
