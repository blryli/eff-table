import XEUtils from 'xe-utils'
export default {
  data() {
    return {
      sorts: []
    }
  },
  methods: {
    sort(prop, order) {
      const column = this.tableColumns.find(d => d.prop === prop)
      column.order = order
      this.sortChange(column)
    },
    clearSort() {
      this.columns.forEach(d => {
        d.order = ''
      })
      this.updateData()
    },
    getSorts(columns) {
      return columns.reduce((acc, column) => {
        const { order, children } = column
        if (children) {
          return acc.concat(this.getSorts(children))
        } else {
          return order ? acc.concat([column]) : acc
        }
      }, [])
    },
    // 从columns获取到列
    getColumn(columnId) {
      const ids = columnId.split('-')
      return ids.reduce((acc, cur) => {
        const { children } = acc
        acc = children ? children[+cur - 1] : acc[+cur - 1]
        return acc
      }, this.columns)
    },
    sortChange(column) {
      const { sortConfig: { multiple } = {}, getSorts } = this
      if (multiple) {
        this.sorts = getSorts(this.columns)
      } else {
        // 如果sorts有值并且不是当前column，则置空order
        if (this.sorts.length && !this.sorts.some(d => d === column)) {
          const oldColumn = this.sorts[0]
          if (oldColumn) {
            const { columnId } = oldColumn
            const col = this.getColumn(columnId)
            col.order = ''
          }
        }
        this.sorts = column.order ? [column] : []
      }
      this.updateData()
    },
    updateData() {
      let tableData = [...this.tableData]
      const { rowId, sorts } = this
      if (!this.tableSortSourceData) {
        this.tableSortSourceData = XEUtils.clone(tableData, true)
      }
      if (sorts.length) {
        const sort = sorts.reduce((acc, column) => {
          const { prop, order, remoteSort, sortMethod } = column
          return acc.concat([remoteSort ? acc : XEUtils.isFunction(sortMethod) ? [sortMethod({ data: tableData, column, $table: this })] : [prop, order]])
        }, [])
        tableData = XEUtils.sortBy(tableData, sort)
      } else {
        tableData = this.tableSortSourceData.map(d => tableData.find(t => t[rowId] === d[rowId]))
        this.tableSortSourceData = null
      }
      this.tableData = tableData
      this.$emit('sort-change', sorts.length === 1 ? sorts[0] : sorts, tableData)
      return tableData
    }
  }
}
