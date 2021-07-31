export default {
  computed: {
    columnWidths() {
      const { bodyColumns, getColumnWidth } = this
      return bodyColumns.reduce((acc, cur) => acc.concat(Math.max(getColumnWidth(cur.width), 40)), [])
    },
    leftWidth() {
      const { bodyColumns, getColumnWidth } = this
      return bodyColumns.reduce((acc, cur) => cur.fixed === 'left' ? acc + Math.max(getColumnWidth(cur.width), 40) : acc, 0)
    },
    rightWidth() {
      const { bodyColumns, getColumnWidth } = this
      return bodyColumns.reduce((acc, cur) => cur.fixed === 'right' ? acc + Math.max(getColumnWidth(cur.width), 40) : acc, 0)
    },
    minWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.width ? acc + Math.max(cur.width, 40) : acc, 0)
    },
    spaceNum() {
      return this.bodyColumns.filter(d => d.width === 40.1).length
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
    // table
    // columnsNest() {
    //   const columnsNest = {}
    //   let childrenLen = 0
    //   const nest = (columns, index = 0, childStartIndex = 0) => {
    //     columnsNest.length = index + 1
    //     columnsNest[index] = columns.reduce((acc, cur, i) => {
    //       if (cur.children) {
    //         nest(cur.children, index + 1, i)
    //         childrenLen += cur.children.length - 1
    //       }
    //       cur.columnspan = cur.children && cur.children.length || 1
    //       cur.index = i + childrenLen + childStartIndex
    //       if (childStartIndex) cur.parent = childStartIndex
    //       return acc.concat([cur])
    //     }, [])
    //     return columnsNest[index]
    //   }
    //   nest(this.visibleColumns)
    //   const columns = Array.from(columnsNest)
    //   const setRowspan = (column, rowspan) => {
    //     if (column.children) {
    //       rowspan -= 1
    //     }
    //     column.rowspan = rowspan
    //     return column
    //   }

    //   const rowspan = columns.length
    //   return columns.map((da, idx) => {
    //     return da.map(d => setRowspan(d, rowspan - idx))
    //   })
    // },
  },
  methods: {
    getColumnWidth(width) {
      const { spaceWidth } = this
      return width === 40.1 ? width + spaceWidth : width
    }
  }
}
