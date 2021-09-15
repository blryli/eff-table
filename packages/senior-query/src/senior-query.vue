<template>
  <card
    :show="show"
    title="高级搜索"
    :min-height="300"
    :height="500"
    :width="800"
    :min-width="400"
    @close="close"
  >
    <template slot="header">
      <VRender :config="{name: 'button', props: {type: 'primary', size: 'mini'}, children: '搜 索', on: {click: search}}" />
    </template>
    <eff-table
      ref="table"
      :columns="columns"
      :toolbar-config="toolbarConfig"
      :tree-config="treeConfig"
      :max-height="400"
      edit
      border
      @data-change="dataChange"
    />
  </card>
</template>

<script>
import Card from 'pk/card'
import XEUtils from 'xe-utils'

// 返回字段集合
// {
//   conditionConnector: '', // 条件连接符
//   fieldName: '', // 字段名
//   operator: '', // 操作符
//   fieldValue: '', // 字段值
//   fieldValueList: [], // 字段值集合
//   childConditionList: [] // 被包含的条件
// }

// 表单字段集合 formFieldList
// {
//   fieldName: '', // 字段名
//   fieldType: '', // 字段类型
//   fieldChildType: '', // 字段子类型，如果字段类型是Object或者Array则子类型必填
//   operateTypeList: [], // 操作类型
//   componentType: '', // 组件类型（input，select）
//   dataSourceType: 0, // 数据源类型（0：无数据源，1：静态数据源，2：接口数据源）
//   apiSource: { // 接口数据（数据源类型为2时必填）
//     fullPath: '', // 接口全路径
//     requestType: '', // 请求类型
//   },
//   staticSourceList: [] // 静态数据集合
// }
let num = 1
const getTreeId = () => '_tree' + num++
export default {
  name: 'SeniorQuery',
  components: { Card },
  data() {
    return {
      queryTable: null,
      treeConfig: { expandAll: true },
      columns: [
        {
          type: 'index',
          width: 60
        },
        {
          title: '条件连接符',
          prop: 'conditionConnector',
          config: { name: 'select', options: [{ label: '&', value: '&' }, { label: '||', value: '||' }] },
          edit: { disabled: ({ row, rowid }) => {
            this.table
            return this.isFristRow(rowid)
          } },
          rules: [
            { required: ({ rowid }) => !this.isFristRow(rowid) }
          ]
        },
        {
          title: '字段名',
          prop: 'fieldName',
          config: { name: 'select', options: () => this.formFieldList.map(d => ({ label: d.fieldName, value: d.fieldName })) },
          width: 100,
          edit: { disabled: ({ row }) => {
            return this.hasChildren(row)
          } },
          rules: [
            { required: ({ row }) => !this.hasChildren(row) }
          ]

        },
        {
          title: '操作符',
          prop: 'operator',
          config: { name: 'select', options: ({ row }) => {
            const { operateTypeList = [] } = this.formFieldList.find(d => d.fieldName === row.fieldName) || {}
            return operateTypeList.map(d => ({ label: d, value: d }))
          } },
          edit: { disabled: ({ row }) => {
            return this.hasChildren(row) || !row.fieldName
          } },
          width: 100,
          rules: [
            { required: ({ row }) => !this.hasChildren(row) }
          ]
        },
        {
          title: '字段值',
          prop: 'fieldValue',
          edit: {
            disabled: ({ row }) => {
              return this.hasChildren(row) || !row.fieldName
            },
            render: (h, { row, prop }) => {
              const field = this.formFieldList.find(d => d.fieldName === row.fieldName) || {}
              const { fieldType, componentType, dataSourceType, apiSource } = field
              // 下拉框
              if (componentType === 'select') {
                const props = {}
                const on = {}
                if (dataSourceType === 2) { // 动态数据源
                  const { fullPath, requestType } = apiSource
                  // 远程搜索
                  Object.assign(props, {
                    filterable: true,
                    remote: true,
                    'remote-method': query => this.remoteMethod({ query, field, fullPath, requestType })
                  })
                  // 初始化options
                  Object.assign(on, { focus: () => this.remoteMethod({ query: '', field, fullPath, requestType }) })
                }
                // 如果是数组
                if (fieldType === 'array') {
                  Object.assign(props, { multiple: true, 'collapse-tags': true })
                }
                return { name: 'select', options: () => field.staticSourceList, props, on }
              } else {
                return { name: 'input' }
              }
            }
          },
          rules: [
            { required: ({ row }) => !this.hasChildren(row) }
          ]
        },
        {
          title: '操作',
          width: 110,
          cellRender: { tag: 'div', children: [
            { name: 'button', props: { icon: 'el-icon-plus' }, attrs: { title: '增加子条件' }, on: { click: this.addChild }},
            { name: 'button', props: { icon: 'el-icon-delete' }, attrs: { title: '删除条件' }, on: { click: this.deletedChild }}
          ] }
        }
      ],
      toolbarConfig: {
        buttons: [
          { name: 'button', children: '添加条件', props: { icon: 'el-icon-plus' }, on: { click: this.add }},
          { name: 'button', children: '清空条件', props: { icon: 'el-icon-delete' }, on: { click: this.clear }},
          { name: 'button', props: { icon: 'el-icon-view' }, help: { effect: 'dark', message: () => this.treeGroup }, children: '预览' }
        ]
      },
      show: false,
      formFieldList: [],
      treeGroup: ''
    }
  },
  inject: ['table'],
  mounted() {
    this.queryTable = this.$refs.table
    const { seniorQueryConfig = {}} = this.table
    const { fieldList } = seniorQueryConfig
    this.formFieldList = fieldList
  },
  methods: {
    dataChange({ tableData }) {
      this.treeGroup = this.getTreeGroup(tableData)
    },
    remoteMethod({ query, field, fullPath, requestType }) {
      const path = `${fullPath}${requestType.toUpperCase() === 'GET' && query ? '/' + query : ''}`
      const params = requestType.toUpperCase() === 'POST' ? query : null
      this.$EFF.request[requestType.toLowerCase()](path, params).then(res => {
        field.staticSourceList = res
      }).catch(res => {
        console.log(res)
      })
    },
    search() {
      this.queryTable.validate(null, true).then(res => {
        const { tableData, treeConfig: { children = 'children' } = {}} = this.queryTable
        const updateSeniorQuery = data => {
          return data.reduce((acc, cur) => {
            const child = cur[children] || []
            const { conditionConnector, fieldName, operator, fieldValue } = cur
            return acc.concat([{ conditionConnector, fieldName, operator, fieldValue, fieldValueList: fieldValue, childConditionList: child.length ? updateSeniorQuery(child) : [] }])
          }, [])
        }
        this.table.seniorQuery = updateSeniorQuery(tableData)
        this.close()
        this.table.commitProxy('query')
      }).catch(res => {
        console.log(res)
      })
    },
    add() {
      const { insert, focus } = this.queryTable
      insert({ children: [] }, -1).then(rowIndex => focus(rowIndex))
    },
    addChild(event, data) {
      const { rowId } = this.queryTable
      const { row } = data
      const { fieldName, operator, fieldValue } = row
      const rowid = row[rowId]
      const childRowid = `${rowid}${getTreeId()}`
      const child = {
        conditionConnector: '',
        fieldName: '',
        operator: '',
        fieldValue: '',
        children: [],
        [rowId]: childRowid
      }
      if (!row.children || !row.children.length) {
        Object.assign(row, { fieldName: '', operator: '', fieldValue: '' })
        Object.assign(child, { conditionConnector: '', fieldName, operator, fieldValue })
      }
      this.queryTable.setTreeExpand(rowid, true)
      row.children.push(child)
      this.queryTable.updateRow(row)
    },
    deletedChild(event, data) {
      this.queryTable.removeTreeExpand(data.row)
    },
    open() {
      this.show = true
      this.queryTable.doLayout()
    },
    close() {
      this.show = false
    },
    clear() {
      this.queryTable.reloadData([])
    },
    isFristRow(rowid) {
      if (!rowid) return false
      const { tableData, rowId, treeConfig: { children = 'children' } = {}} = this.queryTable
      const { path } = XEUtils.findTree(tableData, item => item[rowId] === rowid, children) || {}
      return Boolean(!rowid || !path || path.slice(-1)[0] === '0')
    },
    hasChildren(row) {
      return row.children && row.children.length
    },
    getTreeGroup(data) {
      const { queryTable } = this
      return data.reduce((acc, cur) => {
        const { rowId } = queryTable
        const rowid = cur[rowId]
        if (this.hasChildren(cur)) { // 有树节点
          const { conditionConnector = '' } = cur
          const childStr = this.getTreeGroup(cur.children)
          if (rowid === queryTable.tableData[0][rowId]) {
            return childStr ? acc + `（ ${childStr} ）` : acc
          }
          if (conditionConnector) {
            return childStr ? acc + `${acc ? conditionConnector : ''}（ ${childStr} ）` : acc
          }
          return acc + `（ ${childStr} ）`
        } else {
          const { conditionConnector, fieldName, operator, fieldValue } = cur
          if (fieldName && operator && fieldValue) {
            if (this.isFristRow(rowid)) { // 首行
              return acc + `${fieldName} ${operator} ${fieldValue} `
            }
            if (conditionConnector) {
              return acc + `${acc ? conditionConnector : ''} ${fieldName} ${operator} ${fieldValue} `
            }
            return acc
          }
          return acc
        }
      }, '') || ''
    }
  }
}
</script>
