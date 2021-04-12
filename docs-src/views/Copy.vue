<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          fullscreen
          edit
          border
          :max-height="400"
          :data="data"
          select-range
          copy
        />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="snippet" :code="componentSnippet" lang="html" />
          <div class="plus">+</div>
          <CodeSnippet class="snippet" :code="mainSnippet" lang="js" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
import mock from 'mockjs'

const mainSnippet = `
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

const componentSnippet = `
<eff-table
  ref="table"
  v-model="columns"
  fullscreen
  edit
  border
  :max-height="400"
  :data="data"
/>
`
export default {
  name: 'Copy',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      mainSnippet,
      componentSnippet,
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
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|1000': [
          {
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
