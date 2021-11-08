<template>
  <div class="page-home page">
    <h2>SpanMethod 行列合并</h2>
    <p class="hint">
      自定义 <span class="primary"> span-method </span> 方法合并合并行或列<br>
      支持编辑及复制功能，不能用于虚拟滚动、树形结构、展开行、固定列、行列拖动
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
          edit: true,
          copy: true,
          spanMethod: this.colspanMethod,
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
              edit: true
            },
            {
              show: true,
              prop: 'sex',
              title: '性别',
              edit: true
            },
            {
              show: true,
              prop: 'phone',
              title: '手机',
              edit: true
            }
          ],
          data: [
            { id: 1, name: '张三', sex: '男', phone: '13715201314' },
            { id: 2, name: '李四', sex: '女', phone: '13715201314' },
            { id: 3, name: '王五', sex: '男', phone: '13715201314' },
            { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
          ]
        }
      }
    },
    methods: {
      colspanMethod({ rowIndex, columnIndex }) {
        if (rowIndex % 2 === 0) {
          if (columnIndex === 1) {
            return { rowspan: 2, colspan: 1 }
          } else if (columnIndex === 2) {
            return { rowspan: 1, colspan: 2 }
          } else if (columnIndex === 3) {
            return { rowspan: 0, colspan: 0 }
          }
        }
      }
    }
  }
  `

const htmlCode = `
  <eff-table v-bind="tableOptions" />
  `
export default {
  name: 'SpanMethod',
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
        border: true,
        edit: true,
        copy: true,
        spanMethod: this.colspanMethod,
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
            edit: true
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            edit: true
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            edit: true
          }
        ],
        data: [
          { id: 1, name: '张三', sex: '男', phone: '13715201314' },
          { id: 2, name: '李四', sex: '女', phone: '13715201314' },
          { id: 3, name: '王五', sex: '男', phone: '13715201314' },
          { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
        ]
      }
    }
  },
  methods: {
    colspanMethod({ rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 1) {
          return { rowspan: 2, colspan: 1 }
        } else if (columnIndex === 2) {
          return { rowspan: 1, colspan: 2 }
        } else if (columnIndex === 3) {
          return { rowspan: 0, colspan: 0 }
        }
      }
    }
  }
}
</script>
