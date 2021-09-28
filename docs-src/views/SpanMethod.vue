<template>
  <div class="page-home page">
    <h2>SpanMethod 行列合并</h2>
    <p class="hint">
      数据大于 50 行时自动开启<span class="primary"> 行 </span>虚拟滚动<br>
      展开行与树形数据存在时自动禁用展开行
    </p>
    <section class="demo">
      <div class="section-content">
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
  name: 'SpanMethod',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      data: [],
      tableOptions: {
        maxHeight: 400,
        border: true,
        edit: true,
        data: [],
        columns: [],
        spanMethod: this.colspanMethod
      }
    }
  },
  mounted() {
    this.setColumns(10)
    // this.setColumns(this.form.columnNum)
    this.setData(10)
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
      } else {
        if (columnIndex === 1) {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },
    setColumns(val) {
      let num = 1
      this.tableOptions.columns = [{ type: 'index', width: 60 }].concat(mock.mock({
        ['array|' + val]: [
          {
            show: true,
            prop: 'name',
            title: () => 'name' + num++,
            width: 200,
            edit: true
          },
          {
            show: true,
            prop: 'cname',
            title: () => 'cname' + num++,
            width: 200,
            edit: true
          }
        ]
      }).array)
    },
    setData(val) {
      this.tableOptions.data = mock.mock({
        ['array|' + val]: [
          {
            'name': '@name',
            'cname': '@cname'
          }
        ]
      }).array
    }
  }
}
</script>
