<template>
  <div class="page-home page">
    <h2>Virtual 虚拟滚动</h2>
    <p class="hint">
      数据大于 50 行时自动开启<span class="primary"> 行 </span>虚拟滚动<br>
      展开行与树形数据存在时自动禁用展开行
    </p>
    <section class="demo">
      <div class="section-content">
        <v-form
          :data="form"
          :columns="[
            {title: '列数量',prop: 'columnNum',itemRender:{
              name: 'select',
              options: [{label: 100, value: 100},{label: 500, value: 500},{label: 1000, value: 1000}],
              on: {change: setColumns}
            }},
            {title: '行数量',prop: 'dataNum',itemRender:{
              name: 'select',
              options: [{label: 1000, value: 1000},{label: 3000, value: 3000},{label: 5000, value: 5000}, {label: 10000, value: 10000},{label: 20000, value: 20000}],
              on: {change: setData}
            }},
          ]"
        />
        <eff-table
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
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
import mock from 'mockjs'

const jsCode = `
data() {
  return {
    data: [],
    columns: [
      {
        show: true,
        fixed: 'left',
        type: 'index',
        title: '序号',
        width: 80
      },
      {
        show: true,
        prop: 'name',
        title: '列1',
        width: 200
      },
      {
        show: true,
        prop: 'age',
        title: '列2',
        width: 200
      },
      {
        show: true,
        prop: 'name',
        title: '列3',
        width: 200
      },
      {
        show: true,
        prop: 'age',
        title: '列4',
        width: 200
      },
      {
        show: true,
        prop: 'name',
        title: '列5',
        width: 200
      },
      {
        show: true,
        prop: 'height',
        title: '列6',
        width: 200
      },
      {
        show: true,
        prop: 'name',
        title: '列7',
        width: 200
      },
      {
        show: true,
        prop: 'age',
        title: '列8',
        width: 200
      },
      {
        show: true,
        prop: 'name',
        title: '列9',
        width: 200
      },
      {
        show: true,
        prop: 'age',
        title: '列10',
        width: 200
      }
    ]
  }
}
`

const htmlCode = `
<eff-table
  v-model="columns"
  :data="data"
  :max-height="400"
  border
/>
`
export default {
  name: 'Virtual',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      data: [],
      form: { dataNum: 1000, columnNum: 100 },
      tableOptions: {
        maxHeight: 400,
        border: true,
        data: [],
        columns: []
      }
    }
  },
  mounted() {
    this.setColumns(10)
    // this.setColumns(this.form.columnNum)
    this.setData(this.form.dataNum)
  },
  methods: {
    setColumns(val) {
      let num = 1
      this.tableOptions.columns = mock.mock({
        ['array|' + val]: [
          {
            show: true,
            prop: 'name',
            title: () => '列' + num++,
            width: 200
          }
        ]
      }).array
    },
    setData(val) {
      this.tableOptions.data = mock.mock({
        ['array|' + val]: [
          {
            'name': '@name'
          }
        ]
      }).array
    }
  }
}
</script>
