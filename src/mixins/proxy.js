export default {
  created() {
    const { request } = this.proxyConfig || {}
    request && this.commitProxy('query')
  },
  methods: {
    // 提交指令
    commitProxy(code) {
      const { request } = this.proxyConfig || {}
      const { query, delete: deleted, save } = request || {}
      switch (code) {
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
          typeof deleted === 'function' ? this.delete(deleted) : this.$message.warning(`requst 没有传入函数 ${[code]}`)
          break
        case 'query':
          typeof query === 'function' ? this.query(query) : this.$message.warning(`requst 没有传入函数 ${[code]}`)
          break
        case 'save':
          typeof save === 'function' ? this.save(save) : this.$message.warning(`requst 没有传入函数 ${[code]}`)
          break
        default:
          break
      }
    },
    query(query) {
      this.getList(query).then(res => {
        const { data } = res
        if (data.list) {
          // 有分页
          const { pageNum, pageSize, total } = data
          this.loadTableData(data.list)
          Object.assign(this.pager, { pageNum, pageSize, total })
        } else {
          // 无分页
          this.loadTableData(data)
        }
        // console.log('tableData', JSON.stringify(this.tableData, null, 2))
      })
    },
    getList(query) {
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
    delete(deleted) {
      const { checkeds, tableData } = this
      const checkedsLen = checkeds.length
      if (!checkedsLen) {
        this.$message.warning('请至少选择一条记录！')
        return
      }
      const del = () => {
        this.reloadData(tableData.filter(da => !checkeds.some(d => d === da)))
        this.clearSelection()
      }
      this.$confirm('确定要删除所选记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del()
        this.$message({
          type: 'success',
          message: '成功删除所选记录!'
        })
      })
      // deleted({ body: checkeds }).then(res => {
      //   del()
      // })
    },
    triggerPending() {
      const { checkeds, rowId } = this
      const checkedsLen = checkeds.length
      if (!checkedsLen) {
        this.$message.warning('请至少选择一条记录！')
        return
      }
      let list = [...this.editStore.pendingList]
      checkeds.forEach(item => {
        if (list.some(data => data === item)) {
          list = list.filter(d => !(d[rowId] === item[rowId]))
        } else {
          list = list.concat(item)
        }
      })
      this.editStore.pendingList = [...list]
      this.clearSelection()
    },
    save(save) {
      const { tableData, editStore, rowId, validate } = this
      const { insertList, updateList, pendingList } = editStore
      if (!insertList.length && !updateList.length) {
        this.$message.info('数据未改动！')
        return
      }
      // 校验新增、修改的列，排除删除的列
      const validateList = insertList.concat(updateList).reduce((acc, cur) => {
        cur = tableData.find(d => d[rowId] === cur[rowId])
        return cur && !pendingList.some(item => item === cur) ? acc.concat(cur) : acc
      }, [])
      validate(validateList).catch(errMap => {
        // console.log('errMap', JSON.stringify(errMap, null, 2))
        const { rowIndex, prop } = errMap[0]
        this.focus(rowIndex, prop)
      }).then(success => {
        if (success) {
          this.isLoading = true
          // save({ body: tableData }).then(res => {
          //   this.reloadData(tableData.filter(da => !pendingList.some(d => d === da)))
          // })
          this.reloadData(tableData.filter(da => !pendingList.some(d => d === da)))
          this.$message.success('保存成功！')
          setTimeout(() => {
            this.isLoading = false
          }, 200)
        }
      })
    },
    reloadData(data) {
      this.clearStatus()
      this.loadTableData(data)
    },
    clearStatus() {
      this.editStore = Object.assign({}, {
        insertList: [],
        removeList: [],
        updateList: [],
        pendingList: [],
        oldColumnIndex: 0,
        columnIndex: 0
      })
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
      Object.assign(records, { [rowId]: `row_${tableData.length}` })
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
