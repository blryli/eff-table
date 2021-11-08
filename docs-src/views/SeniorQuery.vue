<template>
  <div class="page-home page">
    <h2>SeniorQuery 高级搜索</h2>
    <p class="hint">
      <span class="primary">toolbarConfig.seniorQuery</span> 设置为 <span class="primary">true</span><br>
      点击 <Icon icon="query" /> 展开搜索框
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table v-bind="tableOptions" />
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
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table v-bind="tableOptions" />
  `
const jsCode = `
  export default {
    data() {
      return {
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
                requestParam: '', // 请求要携带的参数名
                sourceType: 'query', // static为静态数据，query是模糊查询
                apiSource: { // 接口数据（数据源类型为2时必填）
                  label: 'label', // 下拉框label别名
                  value: 'value', // 下拉框value别名
                  fullPath: '', // 接口全路径
                  requestType: '', // 请求类型
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
          },
          proxyConfig: {
            request: {
              query: ({ page, sorts, filters, form, seniorQuery }) => {
                // console.log('query', JSON.stringify({ page, sorts, filters, form, seniorQuery }, null, 2))
                return new Promise(resolve => {
                  setTimeout(() => {
                    resolve([
                      { name: '张三', sex: '男', age: 18, hobby: ['游泳', 'K歌', '女'] },
                      { name: '李四', sex: '女', age: 18, hobby: ['游泳', 'K歌', '男'] },
                      { name: '张三', sex: '男', age: 18, hobby: ['游泳', 'K歌', '女'] },
                      { name: '李四', sex: '女', age: 18, hobby: ['游泳', 'K歌', '男'] }
                    ])
                  }, 500)
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
          ]
        }
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
                requestParam: 'aaa'
              },
              staticSourceList: []
            }
          ]
        },
        proxyConfig: {
          request: {
            query: ({ page, sorts, filters, form, seniorQuery }) => {
              // console.log('query', JSON.stringify({ page, sorts, filters, form, seniorQuery }, null, 2))
              return new Promise(resolve => {
                setTimeout(() => {
                  resolve([
                    { name: '张三', sex: '男', age: 18, hobby: ['游泳', 'K歌', '女'] },
                    { name: '李四', sex: '女', age: 18, hobby: ['游泳', 'K歌', '男'] },
                    { name: '张三', sex: '男', age: 18, hobby: ['游泳', 'K歌', '女'] },
                    { name: '李四', sex: '女', age: 18, hobby: ['游泳', 'K歌', '男'] }
                  ])
                }, 500)
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
        ]
      }
    }
  }
}
</script>
