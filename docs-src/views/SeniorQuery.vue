<template>
  <div class="page-home page">
    <h2>seniorQuery 自定义搜索</h2>
    <p class="hint">
      前置条件<br>
      <span class="primary">toolbarConfig.seniorQuery</span> 属性有内容（请参照底下代码）

    </p>
    <div>
      点击
      <div style="display: inline-block" title="搜索" class="eff-table__diy_search"><div /> <div /></div>展开搜索框<span class="primary">，新增条件</span>后，点击<span class="primary">搜索</span>即可执行搜索
    </div>
    <br>
    <section class="demo">
      <div class="section-content">
        <eff-table v-bind="tableOptions" />
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
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table v-model="columns" :data="data" :toolbar-config="{seniorQuery}" /> 
  `
const jsCode = `
  export default {
    data() {
      return {
        data: [],
        seniorQuery: {
          fields: ['field1', 'field2', 'field3'],
          op: [{ label: '大于', value: '>' }, { label: '等于', value: '=' }, { label: '大于等于', value: '>=' }]
        },
        columns: [
          {
            show: true,
            type: 'index',
            title: '序号',
            width: 80,
            fixed: 'left'
          },
          {
            show: true,
            prop: 'name',
            title: '名字'
          },
          {
            show: true,
            prop: 'sex',
            title: '性别'
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            width: 150
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
      tableOptions: {
        border: true,
        edit: true,
        toolbarConfig: { seniorQuery: true },
        seniorQueryConfig: {
          fieldList: [
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
        },
        proxyConfig: {
          request: {
            query: ({ page, sorts, filters, form, seniorQuery }) => {
              console.log('query', JSON.stringify({ page, sorts, filters, form, seniorQuery }, null, 2))
              const params = { ...form }
              const pageNum = page.pageNum || 1
              const pageSize = page.pageSize || 10
              return new Promise(resolve => {
                resolve([{}])
              })
            }
          }
        },
        columns: [
          {
            type: 'index',
            width: 80
          },
          {
            prop: 'name',
            title: '名字'
          },
          {
            prop: 'sex',
            title: '性别'
          },
          {
            prop: 'age',
            title: '年龄'
          },
          {
            prop: 'hobby',
            title: '爱好',
            cellRender: (h) => ({ name: 'tag', options: ({ row, prop }) => row[prop].map(d => ({ label: d })) })
          }
        ],
        data: [
          { name: '张三', sex: '男', age: 18, hobby: ['游泳', 'K歌', '女'] },
          { name: '李四', sex: '女', age: 18, hobby: ['游泳', 'K歌', '男'] }
        ]
      },
      seniorQuery: {
        fields: ['field1', 'field2', 'field3'],
        op: [{ label: '大于', value: '>' }, { label: '等于', value: '=' }, { label: '大于等于', value: '>=' }]
      }
    }
  }
}
</script>

<style lang="scss">
.eff-table .cell .el-radio__label{
  display: none;
}
.table-toobar__left{
  button{
    padding: 5px 10px;
    border: 1px solid #ddd;
    background-color: #fff;
    cursor: pointer;
    &:hover, &:focus{
      border-color: #ccc;
      background-color: #f5f5f5;
    }
    &:active{
      border-color: #aaa;
      background-color: #f5f5f5;
    }
  }
}
</style>
