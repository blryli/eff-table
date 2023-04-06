import XEUtils from 'xe-utils'
import { getType } from 'pk/utils'
let row_id = 100
export default {
  mounted() {
    const { request } = this.proxyConfig || {}
    request && this.commitProxy('query')
  },
  methods: {
    // 提交指令
    commitProxy(...ags) {
      // console.log('commitProxy', code)
      const { add, insert, focus, triggerPending, checkoutSelectType } = this
      const { request } = this.proxyConfig || {}
      const { query, delete: deleted, save, queryTemplate, saveTemplate, deleteTemplate } = request || {}
      const code = ags[0]
      const codes = [
        { code: 'add', fn: () => add() },
        { code: 'add_focus', fn: () => add().then(rowIndex => focus(rowIndex)) },
        { code: 'insert', fn: () => insert() },
        { code: 'insert_focus', fn: () => insert().then(rowIndex => focus(rowIndex)) },
        { code: 'delete', fn: () => this.delete(deleted) },
        { code: 'mark_cancel', fn: () => triggerPending() },
        { code: 'remove_check_row', fn: () => this.removeCheckRow() },
        { code: 'query', fn: () => query && typeof query === 'function' ? this.query(query) : this.loadTableData() },
        { code: 'save', fn: () => save && typeof save === 'function' && this.save(save) },
        { code: 'query_template', fn: () => queryTemplate && typeof queryTemplate === 'function' && this.queryTemplate(queryTemplate) },
        { code: 'save_template', fn: () => saveTemplate && typeof saveTemplate === 'function' && this.saveTemplate(saveTemplate) },
        { code: 'delete_template', fn: () => deleteTemplate && typeof deleteTemplate === 'function' && this.deleteTemplate(deleteTemplate) },
        { code: 'checkout_select_type', fn: () => checkoutSelectType() },
        { code: 'refresh', fn: () => this.refresh() }
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
      return this.getList(query).then(data => {
        if (!data) data = []
        if (Array.isArray(data)) {
          // 无分页
          this.reloadData(data)
        } else {
          // 有分页
          const { pageNum, pageSize, total } = data
          this.reloadData(data.list || [])
          this.pager && Object.assign(this.pager, { pageNum, pageSize, total })
        }
        this.loadingClose()
        // console.log('tableData', JSON.stringify(this.tableData, null, 2))
      }).catch(e => {
        this.reloadData([])
        this.loadingClose()
        return e
      }).finally(() => {
        this.doLayout()
      })
    },
    getList(query) {
      const { pager: page, sorts, filters, tForm, searchForm, seniorQuery } = this
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
        // 函数模式 seniorQuery
        const form = {}
        for (const prop in tForm) {
          if (prop.indexOf('filter_') < 0) {
            const filterValue = tForm['filter_' + prop]
            form[prop] = filterValue && filterValue.length ? filterValue : tForm[prop]
          }
        }
        const q = query({ page, sorts, filters, form, lineForm: searchForm, seniorQuery })
        return getType(q) === 'Promise' ? q : new Promise(resolve => resolve(q))
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
        rows = XEUtils.clone(tableData)
      } else if (!Array.isArray(rows)) {
        rows = [rows]
      } else {
        rows = [...rows]
      }
      let timer = null
      let data = []
      if (tableData.length === rows.length) {
        rest = tableData.slice(0)
        Object.assign(this.editStore, {
          editRow: {},
          insertList: [],
          removeList: this.editStore.removeList.concat(rows),
          updateList: [],
          pendingList: []
        })
        this.updateCache()
        this.clearSelection()
      } else {
        data = XEUtils.clone(tableData)
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
              clearTimeout(timer)
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
          const tIndex = data.findIndex(d => d[rowId] === id)
          if (tIndex > -1) {
            const rItems = data.splice(tIndex, 1)
            rest.push(rItems[0])
          }
          // console.log('remove', JSON.stringify({ insertList, removeList }, null, 2))
        })
      }
      this.tableData = Object.freeze(data)
      return this.$nextTick().then(() => {
        this.resize()
        return { rows: rest }
      })
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
              this.isLoading = false
            } else {
              this.$message.error(res.message)
            }
          }).catch(e => {
            console.error(e)
            this.updateCache()
            this.clearSelection()
            this.resize()
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
      const tbData = XEUtils.clone(tableData)
      const defRecords = columns.reduce((acc, column) => {
        const { type, prop } = column
        if (['expand', 'selection', 'radio'].indexOf(type) > -1 || !prop) return acc

        const { config = {}, edit = {}} = column
        const { defaultValue } = Object.assign({}, config, edit.render)
        acc[prop] = defaultValue !== undefined ? defaultValue : null
        return acc
      }, {})
      let isObj = false
      if (XEUtils.isArray(records)) {
        records = records.map(d => Object.assign({}, defRecords, d))
      } else {
        records = [Object.assign({}, defRecords, records)]
        isObj = true
      }
      // console.log('records', JSON.stringify(records, null, 2))
      records.forEach((d, i) => {
        if (!d[rowId] || tbData.find(t => t[rowId] === d[rowId]) || records.find((t, idx) => i !== idx && t[rowId] === d[rowId])) {
          this.$set(d, rowId, `row_id_${++row_id}`)
        }
      })

      const checkedsLen = checkeds.length
      if (insertCheckRow && checkedsLen) {
        rowIndex = tbData.findIndex(d => d[rowId] === checkeds[checkedsLen - 1][rowId]) + 1
      }

      const bInsert = () => beforeInsert(isObj ? records[0] : records, rowIndex)

      if (!rowIndex) {
        rowIndex = 0
        bInsert()
        tbData.unshift(...records)
      } else {
        if (rowIndex === -1) {
          rowIndex = tbData.length
          bInsert()
          tbData.push(...records)
        } else {
          bInsert()
          tbData.splice(rowIndex, 0, ...records)
        }
      }
      this.tableData = Object.freeze(tbData)
      this.editStore.insertList.push(...records)
      this.updateCache()
      this.resize()
      return this.$nextTick().then(() => rowIndex)
    },
    refresh() {
      this.$set(this.pager, 'pageNum', 1)
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
