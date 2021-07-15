let row_id = 100
export default {
  created() {
    if (this.footerActionConfig && this.footerActionConfig.pageConfig && this.footerActionConfig.pageConfig.pageSize) {
      this.pager.pageSize = this.footerActionConfig.pageConfig.pageSize
    }

    const { request } = this.proxyConfig || {}
    request && this.commitProxy('query')
  },
  methods: {
    // 提交指令
    commitProxy(...ags) {
      // console.log('commitProxy', code)
      const { add, insert, focus, triggerPending, checkoutSelectType } = this
      const { request } = this.proxyConfig || {}
      const { query, delete: deleted, save, loadChildren } = request || {}
      const code = ags[0]
      const codes = [
        { code: 'add', fn: () => add() },
        { code: 'add_focus', fn: () => add().then(rowIndex => focus(rowIndex)) },
        { code: 'insert', fn: insert },
        { code: 'insert_focus', fn: () => insert().then(rowIndex => focus(rowIndex)) },
        { code: 'mark_cancel', fn: triggerPending },
        { code: 'checkout_select_type', fn: checkoutSelectType },
        { code: 'delete', fn: () => this.delete(deleted) },
        { code: 'remove_check_row', fn: () => this.removeCheckRow() },
        { code: 'query', fn: () => query && typeof query === 'function' ? this.query(query) : this.loadTableData() },
        { code: 'save', fn: () => save && typeof save === 'function' && this.save(save) },
        { code: 'refresh', fn: () => this.refresh() },
        { code: 'loadChildren', fn: () => typeof loadChildren === 'function' && loadChildren(ags[1], ags[2]) }
      ]
      const ccode = codes.find(d => d.code === code)
      return ccode && ccode.fn(ags)
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
          this.reloadData(data)
        } else {
          // 有分页
          const { pageNum, pageSize, total } = data
          this.reloadData(data.list || [])
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
    /**
     * 删除复选/单选框选中的数据
     */
    removeCheckRow() {
      return this.remove(this.checkeds).then(params => {
        this.clearSelection()
        return params
      })
    },
    remove(rows) {
      const { tableData, rowId, editStore, checkeds } = this
      const { insertList, updateList, pendingList, removeList } = editStore
      let rest = []
      if (!rows) {
        rows = [...tableData]
      } else if (!Array.isArray(rows)) {
        rows = [rows]
      } else {
        rows = [...rows]
      }
      let timer = null
      rows.forEach(row => {
        // 保存记录
        const id = row[rowId]
        removeList.push(row)
        if (checkeds.length) {
          const cIndex = checkeds.findIndex(d => d[rowId] === id)
          if (cIndex > -1) {
            checkeds.splice(cIndex, 1)
          }
        }
        // 从新增中移除已删除的数据
        const iIndex = insertList.indexOf(row)
        if (iIndex > -1) {
          insertList.splice(iIndex, 1)
        } else {
          clearTimeout(timer)
          timer = setTimeout(() => {
            this.$message.success('成功删除所选记录!')
          }, 50)
        }
        // 从修改中移除已删除的数据
        const uIndex = updateList.findIndex(d => d[rowId] === id)
        if (uIndex > -1) {
          updateList.splice(uIndex, 1)
        }
        // 从伪删除中移除已删除的数据
        const pIndex = pendingList.findIndex(d => d[rowId] === id)
        if (pIndex > -1) {
          pendingList.splice(pIndex, 1)
        }
        if (tableData === rows) {
          rows = rest = tableData.slice(0)
          this.tableData = []
          this.updateCache()
          this.clearSelection()
          this.resize()
          this.scrollLeftEvent()
        } else {
          const tIndex = tableData.findIndex(d => d[rowId] === id)
          if (tIndex > -1) {
            const rItems = tableData.splice(tIndex, 1)
            rest.push(rItems[0])
          }
        }
        // console.log('remove', JSON.stringify({ insertList, removeList }, null, 2))
      })
      return this.$nextTick().then(() => ({ rows: rest }))
    },
    delete(deleted) {
      const { checkeds } = this
      const checkedsLen = checkeds.length
      if (!checkedsLen) {
        this.$message.warning('请至少选择一条记录！')
        return
      }
      return this.$confirm('确定要删除所选记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (typeof deleted === 'function') {
          this.isLoading = true
          return deleted({ table: this, body: checkeds }).then(res => {
            if (res.success) {
              this.$message.success('成功删除所选记录!')
              this.updateCache()
              this.clearSelection()
              this.resize()
              this.scrollLeftEvent()
              this.isLoading = false
            } else {
              this.$message.error(res.message)
            }
          }).catch(e => {
            console.error(e)
            this.updateCache()
            this.clearSelection()
            this.resize()
            this.scrollLeftEvent()
            this.isLoading = false
          })
        } else {
          return this.removeCheckRow()
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
          return save({ body: { insertList, updateList, pendingList }}).then(res => {
            this.isLoading = false
            this.$message.success('保存成功！')
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
     * 如果 rowIndex 为空则插入到顶部
     * 如果 rowIndex 为 -1 则从插入到底部
     * 如果 rowIndex 为有效行则插入到该行的位置
     * @param {Object/Array} records 新的数据
     * @param {RowIndex} rowIndex 指定行
     * @param {InsertCheckRow} insertCheckRow 插入到指定行
     */
    insert(records, rowIndex, insertCheckRow = true) {
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
      }
      let isObj = false
      if (!Array.isArray(records)) {
        records = [records]
        isObj = true
      }
      // console.log('records', JSON.stringify(records, null, 2))
      records.forEach(d => {
        if (!d[rowId]) {
          Object.assign(d, { [rowId]: `row_${row_id++}` })
        }
      })

      const checkedsLen = checkeds.length
      if (insertCheckRow && checkedsLen) {
        rowIndex = tableData.findIndex(d => d[rowId] === checkeds[checkedsLen - 1][rowId]) + 1
      }

      if (!rowIndex) {
        rowIndex = 0
        beforeInsert(isObj ? records[0] : records, rowIndex)
        this.tableData.unshift(...records)
      } else {
        if (rowIndex === -1) {
          rowIndex = this.tableData.length
          beforeInsert(isObj ? records[0] : records, rowIndex)
          this.tableData.push(...records)
        } else {
          beforeInsert(isObj ? records[0] : records, rowIndex)
          this.tableData.splice(rowIndex, 0, ...records)
        }
      }
      this.editStore.insertList.push(...records)
      this.updateCache()
      this.resize()
      this.scrollLeftEvent()
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
    getRemoveList() {
      return this.editStore.removeList
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
