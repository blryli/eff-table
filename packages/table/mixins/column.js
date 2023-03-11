import XEUtils from 'xe-utils'
export default {
  computed: {
    widths() {
      const { bodyColumns, getColumnWidth } = this
      return bodyColumns.reduce((acc, cur) => {
        const width = cur.width || 0
        const minWidth = cur.minWidth || 0
        const type = cur.type
        const calcWidth = getColumnWidth({ width, minWidth, type })
        acc.columnWidths.push(calcWidth) // 列宽度集合
        acc.allMinWidth += calcWidth // 列总宽度
        if (cur.fixed === 'left') {
          acc.leftWidth += calcWidth // 左固定列宽度
        }
        if (cur.fixed === 'right') {
          acc.rightWidth += calcWidth // 右固定列宽度
        }
        return acc
      }, { columnWidths: [], allMinWidth: 0, leftWidth: 0, rightWidth: 0 })
    },
    // 设置列固定宽度的列总宽度
    minWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.width ? acc + (cur.width || 0) : acc, 0)
    },
    // 设置列最小宽度的列总宽度
    minWidths() {
      return this.bodyColumns.reduce((acc, cur) => !cur.width ? acc + cur.minWidth : acc, 0)
    },
    // 每一份最小宽度占的真实宽度
    spaceWidth() {
      const { bodyWrapperWidth, scrollYwidth, minWidth, minWidths } = this
      if (minWidth > bodyWrapperWidth) return 0
      return XEUtils.toFixed((bodyWrapperWidth - 2 - minWidth - scrollYwidth) / minWidths, 4)
    },
    showSpace() {
      const { widths: { allMinWidth }, bodyWrapperWidth, scrollYwidth } = this
      return allMinWidth + 11 < bodyWrapperWidth - 2 - scrollYwidth
    }
  },
  methods: {
    isTypeColumn(column) {
      return ['selection', 'expand', 'row-drag', 'radio'].includes(column.type)
    },
    getColumnWidth(column) {
      if (this.isTypeColumn(column)) return 30
      const { width, minWidth } = column
      return Math.max(width || Math.max(minWidth * this.spaceWidth, minWidth))
    }
  }
}
