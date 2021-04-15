export default {
  created() {
    this.query()
  },
  methods: {
    // 提交指令
    commitProxy(name) {
      switch (name) {
        case 'insert':
          this.insert()
          break
        case 'insert_focus':
          this.insert().then(({ row }) => this._insert_focus(row))
          break
        case 'mark_cancel':
          this.triggerPending()
          break
        case 'delete':
          this.delete()
          break
        case 'query':
          this.query()
          break
        case 'save':
          this.save()
          break
        default:
          break
      }
    },
    query() {
      const { request } = this.proxyConfig || {}
      const { query } = request || {}
      if (!query) return
      this.getList(query).then(res => {
        const { data } = res
        if (data.list) {
          // 有分页
          const { pageNum, pageSize, total } = data
          this.tableData = data.list
          Object.assign(this.pager, { pageNum, pageSize, total })
        } else {
          // 无分页
          this.tableData = data
        }
        console.log({ tableData: this.tableData })
      })
    },
    getList(query) {
      console.log({ query })
      const { page, sorts, filters, tableForm } = this
      // 配置模式
      if (typeof query === 'object') {
        const formData = Object.assign({}, tableForm)
        // 处理排序条件
        const firstSort = sorts[0]
        if (firstSort) {
          formData.sort = firstSort.prop
          formData.order = firstSort.order
        }
        // 处理筛选条件
        filters.forEach(({ prop, values }) => {
          formData[prop] = values.join(',')
        })
        const { getMethos, url } = query
        return this.$EFF.request({ getMethos, url: `${url}/${page.pageSize}/${page.currentPage}`, formData })
      } else if (typeof query === 'function') {
        // 函数模式
        return query({ page, sorts, filters, form: tableForm })
      }
    },
    delete() {
      const { checkeds, proxyConfig } = this
      const checkedsLen = checkeds.length
      if (!checkedsLen) {
        this.$message.warning('请至少选择一条记录！')
        return
      }
      const { request: { delete: deleted }} = proxyConfig || {}
      deleted({ body: checkeds }).then(res => {
        this.clearSelection()
      })
    },
    triggerPending() {
      const { checkeds, rowId } = this
      const checkedsLen = checkeds.length
      if (!checkedsLen) {
        this.$message.warning('请至少选择一条记录！')
        return
      }
      let list = [...this.editStore.pandingList]
      checkeds.forEach(item => {
        if (list.some(data => data === item)) {
          list = list.filter(d => !(d[rowId] === item[rowId]))
        } else {
          list = list.concat(item)
        }
      })
      this.editStore.pandingList = [...list]
      this.clearSelection()
    },
    save() {
      const { tableData, proxyConfig } = this
      const { request: { delete: save }} = proxyConfig || {}
      save({ body: tableData })
    },
    insert() {
      const { checkeds, columns, tableData, rowId } = this
      const checkedsLen = checkeds.length
      const records = columns.reduce((acc, column) => {
        const { type, prop } = column
        if (['expand', 'selection'].indexOf(type) > -1 || !prop) return acc

        const { config = {}, edit = {}} = column
        const { defaultValue } = Object.assign({}, config, edit.render)
        acc[prop] = defaultValue !== undefined ? defaultValue : null
        return acc
      }, {})
      // console.log('records', JSON.stringify(records, null, 2))
      const row = checkedsLen ? tableData.findIndex(d => d[rowId] === checkeds[checkedsLen - 1][rowId]) : -1
      return this._insert(records, row)
    },
    _insert(records = {}, row = -1) {
      if (!row) {
        this.tableData.unshift(records)
      } else if (row === -1) {
        this.tableData.push(records)
      } else {
        this.tableData.splice(row, 0, records)
      }
      this.editStore.insertList.push(records)
      return this.$nextTick().then(() => row)
    },
    _insert_focus(row = -1) {
      if (!row) {
        this.focus(0)
      } else if (row === -1) {
        this.focus(this.tableData.length - 1)
      } else {
        this.focus(row)
      }
    }
  }
}
