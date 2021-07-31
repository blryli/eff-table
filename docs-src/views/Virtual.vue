<template>
  <div class="page-home page">
    <h2>Virtual 虚拟滚动</h2>
    <p class="hint">
      数据大于 50 行时自动开启<span class="primary"> 行 </span>虚拟滚动<br>
      展开行与树形数据存在时自动禁用展开行
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          v-model="columns"
          :data="data"
          :max-height="400"
          border
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
          title: '列10',
          children: [{ prop: '111', title: '111' }, { prop: '222', title: '222' }, { prop: '333', title: '333' }, { prop: '444', title: '444' }]
        },
        {
          show: true,
          prop: 'age',
          title: '列9',
          width: 200
        }

      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|1000': [
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
  }
}
</script>
