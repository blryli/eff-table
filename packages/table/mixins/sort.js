const orderMap = ['desc', 'asc', '']
let orderKey = 0
export default {
  data() {
    return {
      order: '',
      customColumns: [],
      sorts: (this.sortConfig || {}).sorts || []
    }
  },
  computed: {
    sortColumns() {
      const { tableColumns, customColumns } = this
      return tableColumns.concat(customColumns)
    }
  },
  methods: {
    sort(prop, order) {
      const column = this.sortColumns.find(d => d.prop === prop)
      column.order = order
      this.sortChange(column)
    },
    toggleSort(prop) {
      const { sortColumns, customColumns } = this
      let column = sortColumns.find(d => d.prop === prop)
      if (!column) {
        column = { prop, order: '' }
        customColumns.push(column)
      }
      this.handleClickSort(column)
    },
    handleClickSort(column) {
      const order = column.order || ''
      const index = orderMap.findIndex(d => d === order)
      orderKey = index + 1
      column.order = orderMap[orderKey % 3]
      orderKey++
      this.sortChange(column)
    },
    handleSort(column, order) {
      column.order = column.order && column.order === order ? '' : order
      this.sortChange(column)
    },
    clearSort() {
      this.sortColumns.forEach(d => {
        d.order = ''
      })
      this.customColumns = []
      this.sorts = []
      this.$emit('sort-change', {})
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
      }, this.sortColumns)
    },
    sortChange(column, subtotal) {
      const { sortConfig: { multiple, remote } = {}, getSorts } = this
      if (multiple || subtotal) { // 小计功能要先排序
        this.sorts = getSorts(this.sortColumns)
        this.$emit('sort-change', this.sorts)
      } else {
        // 如果sorts有值并且不是当前column，则置空order
        if (this.sorts.length && !this.sorts.some(d => d === column)) {
          let oldColumn = this.sorts[0]
          if (oldColumn) {
            const { columnId } = oldColumn
            if (columnId) oldColumn = this.getColumn(columnId)
            oldColumn.order = ''
          }
        }
        this.sorts = column.order ? [column] : []
        this.$emit('sort-change', this.sorts)
      }
      remote && this.commitProxy('query')
      return this.$nextTick()
    }
  }
}
