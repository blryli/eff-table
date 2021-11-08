<template>
  <div class="page-home page">
    <h2>SeniorQuery 高级搜索 <router-link class="page-router" to="/SeniorQueryDemo">查看示例</router-link></h2>
    <Document :form="documentForm" />
  </div>
</template>

<script>
import Document from '../../components/Document.vue'

export default {
  name: 'SeniorQueryApi',
  components: {
    Document
  },

  data() {
    return {
      documentForm: {
        props: [
          {
            attribute: 'show',
            explain: '是否展示搜索框',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'data',
            explain: '用于搜索的数据集合',
            type: 'array',
            choosable: '',
            default: '[]',
            code:
`
  [
    {
      fieldName: '', // 字段名
      fieldType: '', // 字段类型
      fieldChildType: '', // 字段子类型，如果字段类型是Object或者Array则子类型必填
      operateTypeList: [], // 操作类型
      componentType: '', // 组件类型（input，select）
      dataSourceType: 0, // 数据源类型（0：无数据源，1：静态数据源，2：接口数据源）
      requestParam: '', // 请求要携带的参数名
      sourceType: 'query', // static为静态数据，query是模糊查询
      apiSource: { // 接口数据（数据源类型为2时必填）
        label: 'label', // 下拉框label别名
        value: 'value', // 下拉框value别名
        fullPath: '', // 接口全路径
        requestType: '', // 请求类型
      },
      staticSourceList: [] // 静态数据集合
    }
  ]

`
          },
          {
            attribute: 'tree-config',
            explain: '搜索框表格的树配置',
            type: 'number',
            choosable: '',
            default: '{}',
            code:
`
  {
    expandAll: false, // 是否展开所有节点
    children: 'children', // 子节点别名
    defaultExpandeds: [] // 默认展开的节点
  }
  
`
          },
          {
            attribute: 'width',
            explain: '默认宽度',
            type: 'number',
            choosable: '',
            default: '800'
          },
          {
            attribute: 'height',
            explain: '默认高度',
            type: 'number',
            choosable: '',
            default: '500'
          },
          {
            attribute: 'min-width',
            explain: '搜索框收缩时的最小宽度',
            type: 'number',
            choosable: '',
            default: '600'
          },
          {
            attribute: 'min-height',
            explain: '搜索框收缩时的最小高度',
            type: 'number',
            choosable: '',
            default: '300'
          }
        ],
        events: [
          {
            attribute: 'search',
            explain: '点击搜索框的搜索按钮时触发',
            default: `array`,
            code:
`
  // 回调参数
  [
    {
      conditionConnector: '', // 条件连接符
      fieldName: '', // 字段名
      operator: '', // 操作符
      fieldValue: '', // 字段值
      fieldValueList: [], // 字段值集合
      childConditionList: [] // 被包含的条件
    }
  ]

`
          }
        ]
      }
    }
  }
}
</script>
