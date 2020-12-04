export default {
  data() {
    return {
      curSort: {}
    }
  },
  methods: {
    sort(prop, order) {
      const column = this.columns.find(d => d.prop === prop)
      this.sortChange({ column, prop, order }, true)
    },
    clearSort() {
      this.curSort = {}
      this.updateData()
    },
    sortChange(sort, method) {
      const { prop: sortProp, order: sortOder } = this.curSort
      const { prop, order } = sort
      this.curSort = !method && sortProp === prop && sortOder === order ? {} : sort
      this.$emit('sort-change', this.curSort)
      this.updateData()
    },
    updateData() {
      let tableData = [...this.data]
      const { column = {}, prop, order } = this.curSort
      const { sortMethod, remoteSort } = column
      if (order) {
        if (!remoteSort) {
          if (sortMethod) {
            tableData = sortMethod({ data: tableData, column, prop, order, $table: this }) || tableData
          } else {
            const reverse = order === 'asc' ? 1 : -1
            tableData = this.sortBy(tableData, prop, reverse)
          }
        }
      }
      this.tableData = Object.freeze(tableData)
      return tableData
    },
    sortBy(data, prop, reverse) {
      return data.sort((a, b) => a[prop] > b[prop] ? 1 * reverse : -1 * reverse)
    }
  }
}
