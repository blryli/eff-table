import XEUtils from 'xe-utils'
export default {
  data() {
    return {
      sorts: (this.sortConfig || {}).sorts || []
    }
  },
  methods: {
    sort(prop, order) {
      const column = this.tableColumns.find(d => d.prop === prop)
      column.order = order
      this.sortChange(column)
    },
    clearSort() {
      this.tableColumns.forEach(d => {
        d.order = ''
      })
      this.resetSort()
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
      }, this.tableColumns)
    },
    sortChange(column, subtotal) {
      const { sortConfig: { multiple } = {}, getSorts } = this
      if (multiple || subtotal) {
        this.sorts = getSorts(this.tableColumns)
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
      return this.toSort()
    },
    resetSort() {
      const { tableData, rowId } = this
      this.tableData = Object.freeze(this.tableSortSourceData.map(d => tableData.find(t => t[rowId] === d[rowId])))
      this.tableSortSourceData = null
    },
    toSort() {
      let tableData = XEUtils.clone(this.tableData)
      const { sorts, sortConfig = {}} = this
      if (!this.tableSortSourceData) {
        this.tableSortSourceData = XEUtils.clone(tableData, true)
      }
      // sorts有值则排序
      if (sorts.length) {
        const { sortMethod, remote } = sortConfig
        const sort = sorts.reduce((acc, column) => {
          const { prop, order } = column
          return acc.concat([XEUtils.isFunction(sortMethod) ? [sortMethod({ data: tableData, column, prop, order, $table: this })] : [prop, order]])
        }, [])
        !remote && sort.length && (tableData = XEUtils.sortBy(tableData, sort))
      } else {
        // sorts没值则还原
        this.resetSort()
      }
      this.tableData = Object.freeze(tableData)
      this.$emit('sort-change', sorts.length === 1 ? sorts[0] : sorts, tableData)
      return this.$nextTick()
    }
  }
}
