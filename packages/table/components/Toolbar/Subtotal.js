import XEUtils from 'xe-utils'
export default {
  name: 'Subtotal',
  inject: ['table'],
  render(h) {
    return h('icon', { props: { icon: 'subtotal' }, nativeOn: { click: this.subtotal }})
  },
  methods: {
    subtotal() {
      const { table } = this
      const { headerCheckedColumns, tableColumns } = table
      if (headerCheckedColumns.length) {
        const columns = [...tableColumns]
        columns.map(d => {
          if (headerCheckedColumns.some(h => h === d)) {
            d.order = 'asc'
          }
        })
        this.$set(table, 'tableColumns', columns)
        table.sortChange(null, true).then(() => {
          const tableData = [...table.tableData]
          if (tableData.length) {
            headerCheckedColumns.filter(column => {
              let isNumber = true
              tableData.slice(0, 2).forEach(d => {
                const { prop } = column
                if (prop && !XEUtils.toNumber(d[prop])) isNumber = false
              })
              return isNumber
            })
          }
          // const data = table.tableData
        })
      } else {
        this.$message.warning('请先选择列！')
      }
    },
    clear() {
      this.table.clearSearch()
    }
  }
}
