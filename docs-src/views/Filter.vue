<template>
  <div class="page-home page">
    <h2>Filter 筛选</h2>
    <p class="hint">
      设置column<span class="primary"> filter </span>属性为<span class="primary"> true </span>开启筛选功能<br>
      <span class="primary"> filters </span> 配置过滤选项，<span class="primary"> filterMethod </span> 设置筛选方法
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

const jsCode = `
  export default {
    data() {
      return {
        tableOptions: {
          maxHeight: 400,
          border: true,
          columns: [
            {
              show: true,
              prop: 'id',
              title: 'ID'
            },
            {
              show: true,
              prop: 'name',
              title: '名字',
              filter: true
            },
            {
              show: true,
              prop: 'sex',
              title: '性别',
              filter: true,
              filters: [{ label: '男', value: '男' }, { label: '女', value: '女' }]
            },
            {
              show: true,
              prop: 'age',
              title: '年龄',
              filter: true,
              filters: [{ label: '大于20岁', value: '20' }],
              filterMethod: ({ cellValue }) => {
                return cellValue > 20
              }
            },
            {
              show: true,
              prop: 'phone',
              title: '手机'
            }
          ],
          data: [
            { id: 1, name: '张三', age: 42, sex: '男', phone: '13715201314' },
            { id: 2, name: '李四', age: 24, sex: '女', phone: '13715201314' },
            { id: 3, name: '王五', age: 36, sex: '男', phone: '13715201314' },
            { id: 4, name: '赵六', age: 18, sex: '男', phone: '13715201314' }
          ]
        }
      }
    }
  }
  `

const htmlCode = `
  <eff-table v-bind="tableOptions" />
  `

export default {
  name: 'EffFilter',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      tableOptions: {
        maxHeight: 400,
        edit: true,
        border: true,
        columns: [
          {
            show: true,
            prop: 'id',
            title: 'ID'
          },
          {
            show: true,
            prop: 'name',
            title: '名字',
            edit: true,
            filter: true
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            filter: true,
            filters: [{ label: '男', value: '男' }, { label: '女', value: '女' }]
          },
          {
            show: true,
            prop: 'age',
            title: '年龄',
            sortable: true,
            filter: true,
            edit: true,
            filters: [{ label: '大于20岁', value: '20' }],
            filterMethod: ({ cellValue }) => {
              return cellValue > 20
            }
          },
          {
            show: true,
            prop: 'phone',
            title: '手机'
          }
        ],
        data: [
          { id: 1, name: '张三', age: 42, sex: '男', phone: '13715201314' },
          { id: 2, name: '李四', age: 24, sex: '女', phone: '13715201314' },
          { id: 3, name: '王五', age: 36, sex: '男', phone: '13715201314' },
          { id: 4, name: '赵六', age: 18, sex: '男', phone: '13715201314' }
        ]
      }
    }
  }
}
</script>
