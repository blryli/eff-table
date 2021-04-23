export default {
  created() {
    const { request } = this.proxyConfig || {}
    request && this.commitProxy('query')
  },
  methods: {
    // 提交指令
    commitProxy(code) {
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
          typeof deleted === 'function' ? this.delete(deleted) : this.$message.warning(`requst 没有传入函数 ${[code]}`)
          break
        case 'query':
          typeof query === 'function' ? this.query(query) : this.$message.warning(`requst 没有传入函数 ${[code]}`)
          break
        case 'save':
          typeof save === 'function' ? this.save(save) : this.$message.warning(`requst 没有传入函数 ${[code]}`)
          break
        case 'loadChildren':
          typeof loadChildren === 'function' ? loadChildren(arguments[1], arguments[2]) : this.$message.warning(`requst 没有传入函数 ${[code]}`)
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
      validate(validateList).catch(errMap => {
        // console.log('errMap', JSON.stringify(errMap, null, 2))
        const { rowIndex, prop } = errMap[0]
        // 聚焦到第一个校验不通过的单元格
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
      const { checkeds, columns, tableData, rowId } = this
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
    }
  }
}
