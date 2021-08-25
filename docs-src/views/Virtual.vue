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
          :columns="[{title: '数据量',prop: 'number',itemRender:{
            name: 'select',
            options: [{label: 1000, value: 1000},{label: 3000, value: 3000},{label: 5000, value: 5000}, {label: 10000, value: 10000},{label: 20000, value: 20000}],
            on: {change: change}
          }}]"
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
      form: { number: 1000 },
      tableOptions: {
        maxHeight: 400,
        border: true,
        data: [],
        columns: [
          {
            show: true,
            prop: 'name',
            title: '列1',
            width: 200
          },
          {
            show: true,
            fixed: 'left',
            type: 'index',
            title: '序号',
            width: 80
          },
          {
            show: true,
            prop: 'age',
            title: '列2',
            width: 200
          },
          {
            show: true,
            prop: '列3',
            title: '列3',
            width: 200
          },
          {
            show: true,
            prop: '列4',
            title: '列4',
            width: 200
          },
          {
            show: true,
            prop: '列5',
            title: '列5',
            width: 200
          },
          {
            show: true,
            prop: '列6',
            title: '列6',
            width: 200
          },
          {
            show: true,
            prop: '列7',
            title: '列7',
            width: 200
          },
          {
            show: true,
            prop: '列8',
            title: '列8',
            width: 200
          },
          {
            show: true,
            prop: '列10',
            title: '列10',
            children: [{ prop: '111', width: 100, title: '111' }, { prop: '222', width: 100, title: '222' }, { prop: '333', width: 100, title: '333' }, { prop: '444', width: 100, title: '444' }, { prop: '555', width: 100, title: '555' }, { prop: '666', width: 100, title: '666' }]
          },
          {
            show: true,
            prop: '列9',
            title: '列9',
            width: 200,
            edit: true
          }
        ]
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.tableOptions.data = mock.mock({
        ['array|' + this.form.number]: [
          {
            'id|+1': 1,
            'name': function name() {
              return this.index % 5 === 0 ? '' : this.cname
            },
            'cname': '@cname',
            'age': /[1-7][0-9]/,
            'height': /1[5-9][0-9]/,
            'index|+1': 1
          }
        ]
      }).array
    }, 50)
  },
  methods: {
    change(val) {
      // console.log(val)
      this.tableOptions.data = mock.mock({
        ['array|' + val]: [
          {
            'id|+1': 1,
            'name': function name() {
              return this.index % 5 === 0 ? '' : this.cname
            },
            'cname': '@cname',
            'age': /[1-7][0-9]/,
            'height': /1[5-9][0-9]/,
            'index|+1': 1
          }
        ]
      }).array
    }
  }
}
</script>
