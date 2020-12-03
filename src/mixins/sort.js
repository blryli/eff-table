import XEUtils from 'xe-utils'

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
            const rest = sortMethod ? tableData.sort(sortMethod) : XEUtils.sortBy(tableData, prop)
            tableData = order === 'desc' ? rest.reverse() : rest
          }
        }
      }
      this.tableData = Object.freeze(tableData)
      return tableData
    }
  }
}
