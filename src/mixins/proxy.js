export default {
  created() {
    this.query()
  },
  methods: {
    query() {
      const { request } = this.proxyConfig || {}
      const { query } = request || {}
      if (!query) return
      this.getList(query).then(res => {
        const { data } = res
        if (data.list) {
          const { pageNum, pageSize, total } = data
          this.tableData = data.list
          this.pager = { ...this.pager, ...{ pageNum, pageSize, total }}
        } else {
          this.tableData = data
        }
        console.log({ tableData: this.tableData })
      })
    },
    getList(query) {
      console.log({ query })
      const { page, sorts, filters, tableForm: form } = this
      if (typeof query === 'object') {
        const data = { ...query, ...{ formData: form }}
        return this.$EFF.request(data)
      } else if (typeof query === 'function') {
        return query({ page, sorts, filters, form })
      }
    }
  }
}
