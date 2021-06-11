export default {
  created() {
    const { request } = this.proxyConfig || {}
    request && this.commitProxy('query')
  },
  methods: {
    // 提交指令
    commitProxy(code) {
      // console.log('commitProxy', code)
      const { request } = this.proxyConfig || {}
      const { query, delete: deleted, save, loadChildren } = request || {}
      switch (code) {
        case 'add':
          this.add()
          break
        case 'add_focus':
          this.add().then(rowIndex => this.focus(rowIndex))
          break
        case 'insert':
          this.insert()
          break
        case 'insert_focus':
          this.insert().then(rowIndex => this.focus(rowIndex))
          break
        case 'mark_cancel':
          this.triggerPending()
          break
        case 'checkout_select_type':
          this.checkoutSelectType()
          break
        case 'delete':
          this.delete(deleted)
          break
        case 'query':
          query && (typeof query === 'function' ? this.query(query) : console.warn(`requst 没有传入函数 ${[code]}`))
          break
        case 'save':
          save && (typeof save === 'function' ? this.save(save) : console.warn(`requst 没有传入函数 ${[code]}`))
          break
        case 'refresh':
          this.refresh()
          break
        case 'loadChildren':
          typeof loadChildren === 'function' ? loadChildren(arguments[1], arguments[2]) : console.warn(`requst 没有传入函数 ${[code]}`)
          break
        default:
          break
      }
    },
    loadingOpen() {
      this.isLoading = true
    },
    loadingClose() {
      this.isLoading = false
    },
    query(query) {
      this.loadingOpen()
      this.getList(query).then(data => {
        if (!data) data = []
        if (Array.isArray(data)) {
          // 无分页
          this.loadTableData(data)
        } else {
          // 有分页
          const { pageNum, pageSize, total } = data
          this.loadTableData(data.list || [])
          Object.assign(this.pager, { pageNum, pageSize, total })
        }
        this.loadingClose()
        // console.log('tableData', JSON.stringify(this.tableData, null, 2))
      }).catch(e => {
        console.error(e)
        this.loadingClose()
      })
    },
    getList(query) {
      const { pager: page, sorts, filters, searchForm } = this
      // 配置模式
      if (typeof query === 'object') {
        const formData = Object.assign({}, { form: searchForm })
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
        return this.$EFF.request({ getMethos, url: `${url}/${page.pageSize}/${page.pageNum}`, formData })
      } else if (typeof query === 'function') {
        // 函数模式
        return query({ page, sorts, filters, form: searchForm })
      }
    },
    delete(deleted) {
      const { checkeds } = this
      const checkedsLen = checkeds.length
      if (!checkedsLen) {
        this.$message.warning('请至少选择一条记录！')
        return
      }
      this.$confirm('确定要删除所选记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (typeof deleted === 'function') {
          this.isLoading = true
          deleted({ table: this, body: checkeds }).then(res => {
            this.$message.success('成功删除所选记录!')
            this.commitProxy('query')
            this.clearSelection()
            this.isLoading = false
          }).catch(e => {
            console.error(e)
            this.clearSelection()
            this.isLoading = false
          })
        } else {
          this.$message.error('requst [delete] 必须是函数!')
        }
      })
    },
    checkoutSelectType() {
      this.tableColumns.forEach(v => {
        if (v.type === 'radio') {
          v.type = 'selection'
        } else if (v.type === 'selection') {
          v.type = 'radio'
        }
      })
      this.clearSelection()
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
          // 被标记删除的行，清除校验
        } else {
          list = list.concat(item)
        }
      })
      const pendingRowIds = list.map(d => d[rowId])
      this.validators = [...this.validators.filter(d => pendingRowIds.indexOf(d.rowId) === -1)]
      this.editStore.pendingList = [...list]
      this.clearSelection()
      return this.$nextTick()
    },
    save(save) {
      const { tableData, editStore, rowId, validate } = this
      const { insertList, updateList, pendingList } = editStore
      if (!insertList.length && !updateList.length && !pendingList.length) {
        this.$message.info('数据未改动！')
        return
      }
      // 校验新增、修改的列，排除删除的列
      const validateList = insertList.concat(updateList).reduce((acc, cur) => {
        cur = tableData.find(d => d[rowId] === cur[rowId])
        return cur && !pendingList.some(item => item === cur) ? acc.concat(cur) : acc
      }, [])
      return validate(validateList).catch(errMap => {
        // console.log('errMap', JSON.stringify(errMap, null, 2))
        // 聚焦到第一个校验不通过的单元格
        const { id, prop } = errMap[0]
        const rowIndex = tableData.findIndex(d => d[rowId] === id)
        this.focus(rowIndex, prop)
      }).then(success => {
        if (success) {
          this.isLoading = true
          save({ body: { insertList, updateList, pendingList }}).then(res => {
            this.isLoading = false
            this.$message.success('保存成功！')
            this.commitProxy('query')
          }).catch(e => {
            console.error(e)
            this.isLoading = false
          })
        }
      })
    },
    // 往表格末尾位置增加临时数据
    add() {
      return this.insert(null, -1)
    },
    /**
     * 往表格指定行中插入临时数据
     * 如果 row 为空则插入到顶部
     * 如果 row 为 -1 则从插入到底部
     * 如果 row 为有效行则插入到该行的位置
     * @param {Object/Array} records 新的数据
     * @param {RowIndex} rowIndex 指定行
     */
    insert(records, rowIndex) {
      const { checkeds, columns, tableData, rowId, beforeInsert } = this
      if (!records) {
        records = columns.reduce((acc, column) => {
          const { type, prop } = column
          if (['expand', 'selection', 'radio'].indexOf(type) > -1 || !prop) return acc

          const { config = {}, edit = {}} = column
          const { defaultValue } = Object.assign({}, config, edit.render)
          acc[prop] = defaultValue !== undefined ? defaultValue : null
          return acc
        }, {})
        Object.assign(records, { [rowId]: `row_${tableData.length}` })
        beforeInsert(records)
      }
      if (!Array.isArray(records)) records = [records]
      // console.log('records', JSON.stringify(records, null, 2))

      const checkedsLen = checkeds.length
      if (checkedsLen) {
        rowIndex = tableData.findIndex(d => d[rowId] === checkeds[checkedsLen - 1][rowId]) + 1
      }

      if (!rowIndex) {
        this.tableData.unshift(...records)
        rowIndex = 0
      } else {
        if (rowIndex === -1) {
          this.tableData.push(...records)
          rowIndex = this.tableData.length - 1
        } else {
          this.tableData.splice(rowIndex, 0, ...records)
        }
      }
      this.editStore.insertList.push(...records)
      this.updateCache()
      return this.$nextTick().then(() => rowIndex)
    },
    refresh() {
      this.commitProxy('query')
    },
    getInsertList() {
      const { rowId, editStore } = this
      const { insertList, pendingList } = editStore
      return insertList.filter(d => !pendingList.find(p => p[rowId] === d[rowId]))
    },
    getUpdateList() {
      const { rowId, editStore } = this
      const { updateList, pendingList } = editStore
      return updateList.filter(d => !pendingList.find(p => p[rowId] === d[rowId]))
    },
    getPendingList() {
      return this.editStore.pendingList
    }
  }
}
