import XEUtils from 'xe-utils'
export default {
  computed: {
    // 列宽度集合
    columnWidths() {
      const { bodyColumns, getColumnWidth } = this
      return bodyColumns.reduce((acc, cur) => acc.concat(getColumnWidth(cur)), [])
    },
    // 列总宽度
    allMinWidth() {
      return this.columnWidths.reduce((acc, cur) => acc + cur, 0)
    },
    leftWidth() {
      const { bodyColumns, getColumnWidth } = this
      return bodyColumns.reduce((acc, cur) => cur.fixed === 'left' ? acc + getColumnWidth(cur) : acc, 0)
    },
    rightWidth() {
      const { bodyColumns, getColumnWidth } = this
      return bodyColumns.reduce((acc, cur) => cur.fixed === 'right' ? acc + getColumnWidth(cur) : acc, 0)
    },
    // 设置了固定宽度的列总宽度
    minWidth() {
      return this.bodyColumns.reduce((acc, cur) => cur.width ? acc + (cur.width || 0) : acc, 0)
    },
    // 设置了最小宽度的列总宽度
    minWidths() {
      return this.bodyColumns.reduce((acc, cur) => !cur.width ? acc + cur.minWidth : acc, 0)
    },
    // 每一份最小宽度占的真实宽度
    spaceWidth() {
      const { bodyWrapperWidth, minWidth, scrollYwidth, minWidths } = this
      if (minWidth > bodyWrapperWidth) return 0
      return XEUtils.toFixed((bodyWrapperWidth - 2 - minWidth - scrollYwidth) / minWidths, 4)
    },
    showSpace() {
      const { allMinWidth, bodyWrapperWidth, scrollYwidth } = this
      console.log('allMinWidth < bodyWrapperWidth - 2 - scrollYwidth', allMinWidth + 11 < bodyWrapperWidth - 2 - scrollYwidth)
      return allMinWidth + 11 < bodyWrapperWidth - 2 - scrollYwidth
    }
  },
  methods: {
    isTypeColumn(column) {
      return ['selection', 'expand', 'row-drag', 'radio'].includes(column.type)
    },
    getColumnWidth(column) {
      if (this.isTypeColumn(column)) return 30
      return Math.max(column.width || Math.max(column.minWidth * this.spaceWidth, column.minWidth))
    }
  }
}
