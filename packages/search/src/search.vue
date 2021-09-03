<template>
  <card
    :show="show"
    title="高级搜索"
    :min-height="300"
    :height="600"
    :width="800"
    :min-width="400"
    @close="close"
  >
    <eff-table
      ref="table"
      :columns="columns"
      :toolbar-config="toolbarConfig"
      :max-height="400"
      edit
      border
    />
  </card>
</template>

<script>
import Card from 'pk/card'

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
export default {
  name: 'DiySearch',
  components: { Card },
  data() {
    return {
      table: null,
      columns: [
        {
          type: 'index',
          width: 60
        },
        {
          title: '条件连接符',
          prop: 'conditionConnector',
          config: { name: 'select', options: [{ label: '&', value: '&' }, { label: '||', value: '||' }] },
          edit: { disabled: ({ row, rowIndex, rowid }) => {
            return Boolean(!rowid || rowid && rowid.slice(-1) === '1')
          } }
        },
        {
          title: '字段名',
          prop: 'fieldName',
          config: { name: 'select', options: () => this.formFieldList.map(d => ({ label: d.fieldName, value: d.fieldName })) },
          width: 100,
          edit: true
        },
        {
          title: '操作符',
          prop: 'operator',
          config: { name: 'select', options: ({ row }) => {
            const { operateTypeList = [] } = this.formFieldList.find(d => d.fieldName === row.fieldName) || {}
            return operateTypeList.map(d => ({ label: d, value: d }))
          } },
          edit: true,
          width: 100
        },
        {
          title: '字段值',
          prop: 'fieldValue',
          edit: {
            render: (h, { row, prop }) => {
              const field = this.formFieldList.find(d => d.fieldName === row.fieldName) || {}
              const { fieldType, componentType, dataSourceType } = field
              // 下拉框
              if (componentType === 'select') {
                if (dataSourceType === 2) { // 动态数据源
                  // const { fullPath, requestType } = apiSource
                  const api = new Promise(resolve => {
                    setTimeout(() => {
                      resolve([{ label: '游泳', value: '游泳' }, { label: 'K歌', value: 'K歌' }])
                    }, 1000)
                  })
                  api.then(res => {
                    field.staticSourceList = res
                  })
                }
                const props = {}
                // 如果是数组
                if (fieldType === 'array') {
                  props.multiple = true
                  props['collapse-tags'] = true
                }
                return { name: 'select', options: () => field.staticSourceList, props }
              } else {
                return { name: 'input' }
              }
            }
          }
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
        buttons: [{ name: 'button', children: '添加条件', props: { icon: 'el-icon-plus' }, on: { click: this.add }}]
      },
      show: false,
      formFieldList: [
        {
          fieldName: 'name', // 字段名
          fieldType: 'string', // 字段类型
          fieldChildType: '', // 字段子类型，如果字段类型是Object或者Array则子类型必填
          operateTypeList: ['=', 'not in'], // 操作类型
          componentType: 'input', // 组件类型（input，select）
          dataSourceType: 0, // 数据源类型（0：无数据源，1：静态数据源，2：接口数据源）
          apiSource: { // 接口数据（数据源类型为2时必填）
            fullPath: '', // 接口全路径
            requestType: '' // 请求类型
          },
          staticSourceList: [] // 静态数据集合
        },
        {
          fieldName: 'sex',
          fieldType: 'string',
          fieldChildType: '',
          operateTypeList: ['=', 'not in'],
          componentType: 'select',
          dataSourceType: 1,
          apiSource: {
            fullPath: '',
            requestType: ''
          },
          staticSourceList: [{ label: '男', value: '1' }, { label: '女', value: '2' }]
        },
        {
          fieldName: 'age',
          fieldType: 'number',
          fieldChildType: '',
          operateTypeList: ['>', '<', '=', '>=', '<=', 'not in'],
          componentType: 'input',
          dataSourceType: 1,
          apiSource: {
            fullPath: '',
            requestType: ''
          },
          staticSourceList: []
        },
        {
          fieldName: 'hobby',
          fieldType: 'array',
          fieldChildType: '',
          operateTypeList: ['=', 'not in'],
          componentType: 'select',
          dataSourceType: 2,
          apiSource: {
            fullPath: '',
            requestType: ''
          },
          staticSourceList: []
        }
      ]
    }
  },
  inject: ['table'],
  computed: {
  },
  watch: {
  },
  mounted() {
    this.table = this.$refs.table
  },
  beforeDestroy() {

  },
  methods: {
    search() {
    },
    add() {
      const { insert, focus } = this.table
      insert({ children: [] }, -1).then(rowIndex => focus(rowIndex))
    },
    addChild(event, data) {
      const { rowId } = this.table
      const { row } = data
      const child = {
        conditionConnector: '',
        fieldName: '',
        operator: '',
        fieldValue: '',
        children: [],
        [rowId]: `${row[rowId]}${row[rowId].indexOf('-') === -1 ? '-' : '.'}${row.children.length + 1}`
      }
      row.children.push(child)
      this.table.updateRow(row)
    },
    deletedChild(event, data) {
    },
    open() {
      this.show = true
      this.table.doLayout()
    },
    close() {
      this.show = false
    },
    reset() {
      this.list = []
    }
  }
}
</script>
