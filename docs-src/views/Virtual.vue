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
          :items="[
            {title: '列数量',prop: 'columnNum',itemRender:{
              name: 'select',
              options: [{label: 50, value: 50},{label: 100, value: 100},{label: 500, value: 500},{label: 1000, value: 1000}],
              on: {change: setColumns}
            }},
            {title: '行数量',prop: 'dataNum',itemRender:{
              name: 'select',
              options: [{label: 1000, value: 1000},{label: 3000, value: 3000},{label: 5000, value: 5000}, {label: 10000, value: 10000},{label: 20000, value: 20000}],
              on: {change: setData}
            }},
          ]"
          style="margin-bottom: 10px;"
        />
        <eff-table ref="table" v-bind="tableOptions" />
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
  import mock from 'mockjs'
  export default {
    data() {
      return {
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
      this.setData(this.form.dataNum)
    },
    methods: {
      setColumns(val) {
        let num = 1
        this.tableOptions.columns = [{ type: 'index', width: 60 }].concat(mock.mock({
          ['array|' + val]: [
            {
              show: true,
              prop: 'name',
              title: () => '列' + num++,
              width: 200
            }
          ]
        }).array)
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
  `

const htmlCode = `
  <v-form
    :data="form"
    :columns="[
      {title: '列数量',prop: 'columnNum',itemRender:{
        name: 'select',
        options: [{label: 100, value: 100},{label: 500, value: 500},{label: 1000, value: 1000},{label: 2000, value: 2000}],
        on: {change: setColumns}
      }},
      {title: '行数量',prop: 'dataNum',itemRender:{
        name: 'select',
        options: [{label: 1000, value: 1000},{label: 3000, value: 3000},{label: 5000, value: 5000}, {label: 10000, value: 10000},{label: 20000, value: 20000}],
        on: {change: setData}
      }},
    ]"
  />
  <eff-table v-bind="tableOptions" />
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
      form: { dataNum: 3000, columnNum: 10 },
      tableOptions: {
        height: '100%',
        border: true,
        data: [],
        columns: [],
        // rowConfig: { rows: [{
        //   height: 50,
        //   show: ({ row }) => {
        //     console.log('row', row)
        //     return true
        //   },
        //   row: ({ row, columns }) => <div style='display: flex;padding: 0 40px'>
        //     {columns.reduce((acc, cur) => {
        //       return acc.concat(<div>{row[cur.prop]}</div>)
        //     }, [])}
        //   </div> }] },
        toolbarConfig: {
          fullscreen: true
        }
      }
    }
  },
  mounted() {
    this.setColumns(this.form.columnNum)
    this.setData(this.form.dataNum)
  },
  methods: {
    setColumns(val) {
      let num = 1
      this.tableOptions.columns = [{ type: 'index', width: 60, fixed: 'left' }].concat(mock.mock({
        ['array|' + val]: [
          {
            show: true,
            prop: 'name',
            title: () => '列' + num++,
            width: 200
          }
        ]
      }).array).concat([{ title: '操作', fixed: 'right', cellRender: () => <el-button type='text'>编辑</el-button> }])
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
