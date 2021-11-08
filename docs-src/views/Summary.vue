<template>
  <div class="page-home page">
    <h2>Summary 合计</h2>
    <p class="hint">
      <span class="primary"> show-summary </span> 属性设置为 <span class="primary"> true </span>，启用合计功能<br>
      <span class="primary"> sum-text </span> 属性配置合计行第一列的文本
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-bind="tableOptions"
        />
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
    <h3>自定义合计</h3>
    <p>通过<span class="primary"> summary-method </span>方法自定义合计行</p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-bind="tableOptions1"
        />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode" />
          <CodeSnippet class="javascript" :code="jsCode1" />
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
          maxHeight: 400,
          showSummary: true,
          sumText: '合计',
          border: true,
          columns: [
            {
              show: true,
              prop: 'id',
              title: 'ID'
            },
            {
              show: true,
              prop: 'driver',
              title: '老司机'
            },
            {
              show: true,
              prop: 'passenger',
              title: '乘客'
            }
          ],
          data: [
            { id: 1, driver: '张三', passenger: '12' },
            { id: 2, driver: '李四', passenger: '33' },
            { id: 5, driver: '王五', passenger: '60' },
            { id: 3, driver: '赵六', passenger: '22' },
            { id: 5, driver: '洪七公', passenger: '88' },
            { id: 4, driver: '周润八', passenger: '33' },
            { id: 5, driver: '九菜', passenger: '6' }
          ]
        }
      }
    }
  }
  `
const jsCode1 = `
  export default {
    data() {
      return {
        tableOptions1: {
          maxHeight: 400,
          showSummary: true,
          summaryMethod: this.summaryMethod,
          border: true,
          columns: [
            {
              show: true,
              prop: 'id',
              title: 'ID'
            },
            {
              show: true,
              prop: 'driver',
              title: '老司机'
            },
            {
              show: true,
              prop: 'passenger',
              title: '乘客'
            }
          ],
          data: [
            { id: 1, driver: '张三', passenger: '12' },
            { id: 2, driver: '李四', passenger: '33' },
            { id: 5, driver: '王五', passenger: '60' },
            { id: 3, driver: '赵六', passenger: '22' },
            { id: 5, driver: '洪七公', passenger: '88' },
            { id: 4, driver: '周润八', passenger: '33' },
            { id: 5, driver: '九菜', passenger: '6' }
          ]
        }
      }
    },
    methods: {
      summaryMethod({ columns, data }) {
        return columns.reduce((acc, column, index) => {
          if (index === 0) {
            acc[index] = '总计'
            return acc
          }
          const { prop } = column
          const map = { passenger: '人' }
          const values = data.map(item => Number(item[prop]))
          const value = values.reduce((acc, cur) => !isNaN(Number(cur)) ? acc + cur : acc, 0)
          acc[index] = value ? value + map[prop] : 'N/A'
          return acc
        }, {})
      }
    }
  }
  `

export default {
  name: 'Summary',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      jsCode1,
      tableOptions: {
        maxHeight: 400,
        showSummary: true,
        sumText: '合计',
        border: true,
        columns: [
          {
            show: true,
            prop: 'id',
            title: 'ID'
          },
          {
            show: true,
            prop: 'driver',
            title: '老司机'
          },
          {
            show: true,
            prop: 'passenger',
            title: '乘客'
          }
        ],
        data: [
          { id: 1, driver: '张三', passenger: '12' },
          { id: 2, driver: '李四', passenger: '33' },
          { id: 5, driver: '王五', passenger: '60' },
          { id: 3, driver: '赵六', passenger: '22' },
          { id: 5, driver: '洪七公', passenger: '88' },
          { id: 4, driver: '周润八', passenger: '33' },
          { id: 5, driver: '九菜', passenger: '6' }
        ]
      },
      tableOptions1: {
        maxHeight: 400,
        showSummary: true,
        summaryMethod: this.summaryMethod,
        border: true,
        columns: [
          {
            show: true,
            prop: 'id',
            title: 'ID'
          },
          {
            show: true,
            prop: 'driver',
            title: '老司机'
          },
          {
            show: true,
            prop: 'passenger',
            title: '乘客'
          }
        ],
        data: [
          { id: 1, driver: '张三', passenger: '12' },
          { id: 2, driver: '李四', passenger: '33' },
          { id: 5, driver: '王五', passenger: '60' },
          { id: 3, driver: '赵六', passenger: '22' },
          { id: 5, driver: '洪七公', passenger: '88' },
          { id: 4, driver: '周润八', passenger: '33' },
          { id: 5, driver: '九菜', passenger: '6' }
        ]
      }
    }
  },
  methods: {
    summaryMethod({ columns, data }) {
      return columns.reduce((acc, column, index) => {
        if (index === 0) {
          acc[index] = '总计'
          return acc
        }
        const { prop } = column
        const map = { passenger: '人' }
        const values = data.map(item => Number(item[prop]))
        const value = values.reduce((acc, cur) => !isNaN(Number(cur)) ? acc + cur : acc, 0)
        acc[index] = value ? value + map[prop] : 'N/A'
        return acc
      }, {})
    }
  }
}
</script>
