<template>
  <div class="page-home page">
    <h2>SeniorQuery 高级搜索 <router-link class="page-router" to="/SeniorQueryApi">查看api</router-link></h2>
    <p class="hint">
      <span class="primary">show </span>属性设置为 <span class="primary"> true / false </span>或调用组件<span class="primary"> open / close </span>方法控制高级搜索弹窗打开与关闭<br>
    </p>
    <section class="demo">
      <div class="section-content">
        <el-button type="primary" size="mini" @click="show = !show">打开高级搜索</el-button>
        <p />
        <SeniorQuery :show.sync="show" :data="seniorQueryList" @search="handleSeniorQuery" />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../../components/CodeSnippet.vue'
import Collapse from '../../components/Collapse.vue'

const htmlCode = `
  <el-button type="primary" size="mini" @click="show = !show">打开高级搜索</el-button>
  <p />
  <SeniorQuery :show.sync="show" :data="seniorQueryList" @search="handleSeniorQuery" />
  `
const jsCode = `
  export default {
    data() {
      return {
        seniorQueryList: [
          {
            fieldName: 'name', // 字段名
            fieldType: 'string', // 字段类型
            fieldChildType: '', // 字段子类型，如果字段类型是Object或者Array则子类型必填
            operateTypeList: [{ label: '等于', value: '=' }, { label: '不包含', value: 'not in' }], // 操作类型
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
            operateTypeList: [{ label: '等于', value: '=' }, { label: '不包含', value: 'not in' }],
            componentType: 'select',
            dataSourceType: 2,
            apiSource: {
              fullPath: 'http://10.10.46.92:6521/api/person/senior/query',
              requestType: 'get'
            },
            staticSourceList: []
          },
          {
            fieldName: 'age',
            fieldType: 'number',
            fieldChildType: '',
            operateTypeList: [
              { label: '大于', value: '>' },
              { label: '小于', value: '<' },
              { label: '等于', value: '=' },
              { label: '大于等于', value: '>=' },
              { label: '小于等于', value: '<=' },
              { label: '不包含', value: 'not in' }
            ],
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
            operateTypeList: [{ label: '等于', value: '=' }, { label: '不包含', value: 'not in' }],
            componentType: 'select',
            dataSourceType: 2,
            apiSource: {
              fullPath: '/path',
              requestType: 'get',
              requestParam: ''
            },
            staticSourceList: []
          }
        ]
      }
    }
  }
  `
export default {
  name: 'SeniorQueryDemo',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      show: false,
      seniorQueryList: [
        {
          fieldName: 'name', // 字段名
          fieldType: 'string', // 字段类型
          fieldChildType: '', // 字段子类型，如果字段类型是Object或者Array则子类型必填
          operateTypeList: [{ label: '等于', value: '=' }, { label: '不包含', value: 'not in' }], // 操作类型
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
          operateTypeList: [{ label: '等于', value: '=' }, { label: '不包含', value: 'not in' }],
          componentType: 'select',
          dataSourceType: 2,
          apiSource: {
            fullPath: 'http://10.10.46.92:6521/api/person/senior/query',
            requestType: 'get'
          },
          staticSourceList: []
        },
        {
          fieldName: 'age',
          fieldType: 'number',
          fieldChildType: '',
          operateTypeList: [
            { label: '大于', value: '>' },
            { label: '小于', value: '<' },
            { label: '等于', value: '=' },
            { label: '大于等于', value: '>=' },
            { label: '小于等于', value: '<=' },
            { label: '不包含', value: 'not in' }
          ],
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
          operateTypeList: [{ label: '等于', value: '=' }, { label: '不包含', value: 'not in' }],
          componentType: 'select',
          dataSourceType: 2,
          apiSource: {
            fullPath: '/path',
            requestType: 'get',
            requestParam: ''
          },
          staticSourceList: []
        }
      ]
    }
  },
  methods: {
    handleSeniorQuery(seniorQuery) {
      console.log('seniorQuery', JSON.stringify(seniorQuery, null, 2))
    }
  }
}
</script>
