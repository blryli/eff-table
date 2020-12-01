export default {
  computed: {
    columnWidths() {
      return this.bodyColumns.reduce((acc, cur) => acc.concat(Math.max((cur.width || this.spaceWidth), 40)), [])
    },
    leftWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.fixed === 'left' ? acc + Math.max((cur.width || this.spaceWidth), 40) : acc, 0)
    },
    rightWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.fixed === 'right' ? acc + Math.max((cur.width || this.spaceWidth), 40) : acc, 0)
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
    },
    columnsNest() {
      const columnsNest = {}
      let childrenLen = 0
      const nest = (columns, index = 0, childStartIndex = 0) => {
        columnsNest.length = index + 1
        columnsNest[index] = columns.reduce((acc, cur, i) => {
          if (cur.children) {
            nest(cur.children, index + 1, i)
            childrenLen += cur.children.length - 1
          }
          cur.colspan = cur.children && cur.children.length || 1
          cur.index = i + childrenLen + childStartIndex
          if (childStartIndex) cur.parent = childStartIndex
          return acc.concat([cur])
        }, [])
        return columnsNest[index]
      }
      nest(this.visibleColumns)
      const columns = Array.from(columnsNest)
      const setRowspan = (column, rowspan) => {
        if (column.children) {
          rowspan -= 1
        }
        column.rowspan = rowspan
        return column
      }

      const rowspan = columns.length
      return columns.map((da, idx) => {
        return da.map(d => setRowspan(d, rowspan - idx))
      })
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
