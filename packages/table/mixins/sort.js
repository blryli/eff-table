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
      this.sorts = []
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
      const { prop, order } = column
      if (multiple || subtotal) { // 小计功能要先排序
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
      this.$emit('sort-change', { column, prop, order, sorts: this.sorts })
      return this.$nextTick()
    }
  }
}
