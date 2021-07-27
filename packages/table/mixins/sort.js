import XEUtils from 'xe-utils'
export default {
  data() {
    return {
      curSort: {}
    }
  },
  computed: {
    sorts() {
      const { curSort } = this
      return curSort.prop ? [curSort] : []
    }
  },
  methods: {
    sort(prop, order) {
      const column = this.tableColumns.find(d => d.prop === prop)
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
      this.updateData()
    },
    updateData() {
      let tableData = [...this.tableData]
      const { rowId } = this
      const { column = {}, prop, order } = this.curSort
      const { sortMethod, remoteSort } = column
      if (!this.tableSortSourceData) {
        this.tableSortSourceData = XEUtils.clone(tableData, true)
      }
      if (order) {
        if (!remoteSort) {
          if (sortMethod) {
            tableData = sortMethod({ data: tableData, column, prop, order, $table: this }) || tableData
          } else {
            tableData = XEUtils.sortBy(tableData, [[prop, order]])
          }
        }
      } else {
        tableData = this.tableSortSourceData.map(d => tableData.find(t => t[rowId] === d[rowId]))
        this.tableSortSourceData = null
      }
      this.tableData = tableData
      this.$emit('sort-change', this.curSort, tableData)
      return tableData
    }
  }
}
