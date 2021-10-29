<template>
  <div class="page-home page">
    <h2>SeniorQuery 高级搜索</h2>
    <p class="hint">
      <span class="primary">toolbarConfig.seniorQuery</span> 设置为 <span class="primary">true</span><br>
      点击 <Icon icon="query" /> 展开搜索框
    </p>
    <section class="demo">
      <div class="section-content">
        <SeniorQuery ref="seniorQuery" :field-list="seniorQueryList" @search="handleSeniorQuery" />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="snippet" :code="htmlCode" lang="html" />
          <div class="plus">+</div>
          <CodeSnippet class="snippet" :code="jsCode" lang="js" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../../components/CodeSnippet.vue'
import Collapse from '../../components/Collapse.vue'

const htmlCode = `
  <eff-table v-bind="tableOptions" />
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
            dataSourceType: 2,
            apiSource: {
              fullPath: '/path',
              requestType: 'get'
            },
            staticSourceList: []
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
              fullPath: '/path',
              requestType: 'get'
            },
            staticSourceList: []
          }
        ]
      }
    }
  }
  `
export default {
  name: 'SeniorQuery',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      seniorQueryList: [
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
            fullPath: '/path',
            requestType: 'get'
          },
          staticSourceList: []
        }
      ]
    }
  }
}
</script>
