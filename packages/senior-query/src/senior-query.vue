<template>
  <card
    class="eff-senior-query"
    :show="visible"
    title="高级搜索"
    :width="width"
    :height="height"
    :min-width="minWidth"
    :min-height="minHeight"
    @close="close"
    @size-change="cardSizeChange"
  >
    <template slot="header">
      <VRender :config="{name: 'button', props: {type: 'primary', size: 'mini'}, children: '搜 索', on: {click: search}}" />
    </template>
    <div class="eff-senior-query--view">
      <span class="eff-senior-query--view-title">预览</span>
      <Conditions v-model="treeGroup" :preview-use-operator="previewUseOperator" @remove="removeTreeExpand" />
    </div>
    <eff-table
      ref="table"
      :columns="columns"
      :toolbar-config="toolbarConfig"
      :tree-config="tableTreeConfig"
      :max-height="400"
      row-drag
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

// 表单字段集合 fieldList
// {
//   fieldName: '', // 字段名
//   fieldType: '', // 字段类型
//   fieldChildType: '', // 字段子类型，如果字段类型是Object或者Array则子类型必填
//   operateTypeList: [], // 操作类型
//   componentType: '', // 组件类型（input，select）
//   dataSourceType: 0, // 数据源类型（0：无数据源，1：静态数据源，2：接口数据源）
//   requestParam: '', // 请求要携带的参数名
//   sourceType: 'query', // static为静态数据，query是模糊查询
//   apiSource: { // 接口数据（数据源类型为2时必填）
//     label: 'label', // 下拉框label别名
//     value: 'value', // 下拉框value别名
//     fullPath: '', // 接口全路径
//     requestType: '', // 请求类型
//   },
//   staticSourceList: [] // 静态数据集合
// }
let num = 1
const getTreeId = () => '_tree' + num++
export default {
  name: 'SeniorQuery',
  components: {
    Card,
    Conditions: {
      name: 'Conditions',
      functional: true,
      render(h, context) {
        const { props: { value, previewUseOperator }, listeners } = context
        const { remove } = listeners
        const getRender = list => {
          return list.reduce((acc, cur) => {
            const { row, code, children, conditionConnector } = cur
            const connector = conditionConnector ? h('span', { class: 'eff-view-list-connector' }, previewUseOperator ? conditionConnector : (conditionConnector === '&' ? '与' : '或')) : ''
            if (children) {
              return acc.concat(h('span', {}, [connector, '( ', getRender(children), ' )']))
            } else {
              return acc.concat([h('span', { class: 'eff-view-list-item' }, [
                connector, h('span', { class: 'eff-view-list-item--code' },
                  [h('span', {}, code), h('span', { class: 'eff-view-list-item--close', on: { click: () => remove && remove(row) }})]
                )
              ])])
            }
          }, [])
        }
        return h('span', { class: 'eff-view-list' }, getRender(value))
      }
    }
  },
  props: {
    show: Boolean,
    data: { type: Array, default: () => ([]) },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 500 },
    minWidth: { type: Number, default: 600 },
    minHeight: { type: Number, default: 300 },
    treeConfig: { type: Object, default: () => {} },
    preview: { type: Boolean, default: true },
    previewUseOperator: Boolean
  },
  data() {
    return {
      operatorOptions: [],
      columns: [
        {
          type: 'index',
          width: 60
        },
        {
          title: '条件连接符',
          prop: 'conditionConnector',
          config: { name: 'select', options: [{ label: '与', value: '&' }, { label: '或', value: '||' }] },
          edit: { disabled: ({ row, rowid }) => {
            return this.isFristRow(rowid)
          } },
          rules: [
            { required: ({ rowid }) => !this.isFristRow(rowid) }
          ]
        },
        {
          title: '字段名',
          prop: 'fieldName',
          config: { name: 'select', options: () => this.data.map(d => ({ label: d.fieldName, value: d.fieldName })) },
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
          config: {
            name: 'select',
            options: ({ row }) => {
              const { operateTypeList = [] } = this.data.find(d => d.fieldName === row.fieldName) || {}
              return operateTypeList
            },
            on: {
              focus: (e, { row }) => {
                const { operateTypeList = [] } = this.data.find(d => d.fieldName === row.fieldName) || {}
                this.operatorOptions = operateTypeList
              },
              change: (val, { row }) => {
                const option = this.operatorOptions.find(d => d.value === val)
                if (option) {
                  row.operatorName = option.label
                }
              }
            }
          },
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
            render: (h, { row, prop, rowIndex, columnIndex }) => {
              const field = this.data.find(d => d.fieldName === row.fieldName) || {}
              const { fieldType, componentType, componentProps, componentRender, dataSourceType, apiSource, usePopup } = field
              // 自定义
              let opts = {}
              if (componentRender) {
                if (XEUtils.isFunction(componentRender)) return componentRender(h, { row })
                opts = Object.assign(componentRender, { name: 'input' })
              } else if (componentType === 'select') { // 下拉框
                const props = {}
                const on = {}
                if (dataSourceType === 2) { // 动态数据源
                  const { label, value, fullPath, requestType, requestParam, sourceType } = apiSource
                  // 支持远程搜索
                  Object.assign(props, {
                    filterable: true,
                    labelKey: label,
                    valueKey: value
                  }, componentProps)
                  // 模糊查询
                  if (sourceType === 'query') {
                    Object.assign(props, {
                      remote: true,
                      'remote-method': query => this.remoteMethod({ query, field, fullPath, requestType, requestParam })
                    })
                  }
                  // 初始化options/静态数据
                  Object.assign(on, { focus: () => this.remoteMethod({ query: '', field, fullPath, requestType, requestParam }) })
                }
                // 字段类型是数组为多选
                if (fieldType === 'array') {
                  Object.assign(props, { multiple: true, 'collapse-tags': true })
                }
                opts = { name: 'select', options: () => field.staticSourceList, props, on }
              } else if (componentType === 'date') {
                opts = { name: 'date-picker', props: componentProps }
              } else {
                opts = { name: 'input', props: componentProps }
              }
              if (usePopup) {
                opts = {
                  name: 'popup',
                  props: { content: row[prop] },
                  key: rowIndex + columnIndex,
                  children: {
                    name: 'form',
                    props: {
                      titleWidth: '40px',
                      data: row,
                      autofocus: true,
                      columns: [
                        { prop, span: 24, itemRender: { name: componentType, props: componentProps, on: {
                          input: (val) => this.$set(row, prop, val)
                        }}}
                      ]
                    },
                    on: { loop: ({ placement }) => this.$refs.table1 && this.$refs.table1.toX(placement) }
                  }
                }
              }
              return opts
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
          { name: 'button', children: '添加条件', props: { icon: 'el-icon-plus', size: 'mini' }, on: { click: this.add }},
          { name: 'button', children: '清空条件', props: { icon: 'el-icon-delete', size: 'mini' }, on: { click: this.clear }}
          // { name: 'button', props: { icon: 'el-icon-view' }, help: { effect: 'dark', message: () => this.treeGroup }, children: '预览' }
        ]
      },
      visible: this.show,
      treeGroup: []
    }
  },
  watch: {
    show(show) {
      this.visible = show
    },
    visible(visible) {
      this.$emit('update:show', visible)
    }
  },
  created() {
    Object.assign(this, {
      tableTreeConfig: Object.assign({ expandAll: false, children: 'children', defaultExpandeds: [] }, this.treeConfig)
    })
  },
  mounted() {
    this.table = this.$refs.table
  },
  methods: {
    dataChange({ tableData }) {
      this.treeGroup = this.getTreeGroup(tableData)
    },
    remoteMethod({ query, field, fullPath, requestType, requestParam }) {
      const paramGet = requestParam ? `?${requestParam}=${query}` : `?${query}`
      const path = `${fullPath}${requestType.toUpperCase() === 'GET' && query ? paramGet : ''}`
      const paramPost = requestType.toUpperCase() === 'POST' ? (requestParam ? { [requestParam]: query } : query) : null
      this.$EFF.request[requestType.toLowerCase()](path, paramPost).then(res => {
        const { success, data, message } = res.data
        if (success) {
          field.staticSourceList = data
        } else {
          console.error(message)
        }
      }).catch(res => {
        console.error(res)
      })
    },
    search() {
      this.table.validate(null, true).then(res => {
        const { tableData } = this.table
        const updateSeniorQuery = data => {
          return data.reduce((acc, cur) => {
            const child = cur.children || []
            const { conditionConnector, fieldName, operator, fieldValue } = cur
            // 统一把带回车符的字符串转换成数组
            const value = XEUtils.isString(fieldValue) && /\n/.test(fieldValue) ? fieldValue.split('\n') : fieldValue
            return acc.concat([{ conditionConnector, fieldName, operator, fieldValue: value, fieldValueList: value, childConditionList: child.length ? updateSeniorQuery(child) : [] }])
          }, [])
        }
        this.close()
        this.$emit('search', updateSeniorQuery(tableData))
      }).catch(res => {
        console.log(res)
      })
    },
    add() {
      const { table } = this
      const { insert, focus } = table
      const row = { children: [] }
      if (table.tableData.length) {
        row.conditionConnector = '&'
      }
      insert(row, -1).then(rowIndex => focus(rowIndex, 'fieldName'))
    },
    addChild(event, data) {
      const { rowId } = this.table
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
      this.table.setTreeExpand(rowid, true)
      row.children.push(child)
      this.table.updateRow(row)
    },
    deletedChild(event, data) {
      this.removeTreeExpand(data.row)
    },
    removeTreeExpand(row) {
      this.table.removeTreeExpand(row)
    },
    open() {
      this.visible = true
      this.table.doLayout()
    },
    close() {
      this.visible = false
      this.$emit('close')
    },
    clear() {
      this.table.reloadData([])
    },
    isFristRow(rowid) {
      if (!rowid) return false
      const { tableData, rowId } = this.table
      const { path } = XEUtils.findTree(tableData, item => item[rowId] === rowid, 'children') || {}
      return Boolean(!rowid || !path || path.slice(-1)[0] === '0')
    },
    hasChildren(row) {
      return row.children && row.children.length
    },
    getTreeGroup(data) {
      const { table, previewUseOperator } = this
      return data.reduce((acc, row) => {
        const { rowId } = table
        const rowid = row[rowId]
        if (this.hasChildren(row)) { // 有树节点
          const { conditionConnector = '' } = row
          const children = this.getTreeGroup(row.children)
          if (rowid === table.tableData[0][rowId]) { // 处理第一行数据
            return children ? acc.concat([{ row, rowid, children }]) : acc
          }
          if (conditionConnector) {
            return children ? acc.concat([{ row, rowid, conditionConnector, children }]) : acc
          }
          return acc.concat([{ row, rowid, children }])
        } else {
          const { conditionConnector, fieldName, operator, operatorName, fieldValue } = row
          if (fieldName && operator && fieldValue) {
            const code = `${fieldName} ${previewUseOperator ? operator : operatorName || operator} ${fieldValue} `
            if (this.isFristRow(rowid)) { // 首行
              return acc.concat([{ row, rowid, code }])
            }
            if (conditionConnector) {
              return acc.concat([{ row, rowid, code, conditionConnector }])
            }
            return acc
          }
          return acc
        }
      }, []) || []
    },
    cardSizeChange() {
      this.table.doLayout()
    }
  }
}
</script>

<style lang="scss">
.eff-senior-query--view{
  margin-bottom: 10px;
  font-size: 12px;
  &-title{
    margin-right: 10px;
    font-size: 12px;
    font-weight: bold;
  }
  span{
    display: inline-block;
  }
}
.eff-view-list{
  &-item{
    &--code{
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 4px;
      color: #409eff;
      border: 1px solid #d9ecff;
      background-color: #ecf5ff;
    }
    &--close {
      position: relative;
      width: 14px;
      height: 14px;
      margin-left: 5px;
      border-radius: 50%;
      margin-bottom: -3px;
      box-sizing: content-box;
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 3px;
        top: 6px;
        width: 9px;
        height: 1px;
        background-color: #409eff;
      }
      &::before {
        transform: rotate(-45deg);
      }
      &::after {
        transform: rotate(45deg);
      }
      &:hover {
        cursor: pointer;
        background-color: #409eff;
        &::before,
        &::after {
          background-color: #fff;
        }
      }
    }
  }
  &-connector{
    margin: 0 5px;
  }
}
</style>
