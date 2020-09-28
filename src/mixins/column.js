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
      return style
    }
  }
}
