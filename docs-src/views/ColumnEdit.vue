<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :loading="loading"
          :max-height="400"
          drag
          column-control
          row-drag
          border
          fullscreen
          column-batch-control
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
        type: 'selection',
        width: 40,
        fixed: 'left'
      },
      {
        show: true,
        prop: 'index',
        title: '序号',
        width: 80,
        fixed: 'left'
      },
      {
        show: true,
        prop: 'city',
        title: '城市',
        width: 140
      },
      {
        show: true,
        prop: 'name',
        title: '名字',
        children: [{
          show: true,
          prop: 'cfirst',
          title: '姓',
          width: 150
        }, {
          show: true,
          prop: 'clast',
          title: '名',
          width: 150
        }]
      },
      {
        show: true,
        prop: 'email',
        title: '邮箱',
        width: 150
      },
      {
        show: true,
        prop: 'phone',
        title: '手机',
        width: 150
      },
      {
        show: true,
        prop: 'datetime',
        title: '核酸检测时间',
        width: 150
      }
    ]
  }
}
`

const htmlCode = `
<eff-table
  v-model="columns"
  :data="data"
  drag
  column-control
  row-drag
  border
  fullscreen
  column-batch-control
/>
`
export default {
  name: 'ColumnBatchControl',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      jsCode,
      htmlCode,
      loading: false,
      data: [],
      columns: [
        {
          show: true,
          type: 'selection',
          width: 40,
          fixed: 'left'
        },
        {
          show: true,
          prop: 'index',
          title: '序号',
          width: 80,
          fixed: 'left'
        },
        {
          show: true,
          prop: 'city',
          title: '城市',
          width: 140
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          children: [{
            show: true,
            prop: 'cfirst',
            title: '姓',
            width: 150
          }, {
            show: true,
            prop: 'clast',
            title: '名',
            width: 150
          }]
        },
        {
          show: true,
          prop: 'email',
          title: '邮箱',
          width: 150
        },
        {
          show: true,
          prop: 'phone',
          title: '手机',
          width: 150
        },
        {
          show: true,
          prop: 'datetime',
          title: '核酸检测时间',
          width: 150
        }
      ]
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.data = mock.mock({
        'array|500': [
          {
            'city': '@city',
            'cfirst': '@cfirst',
            'clast': '@clast',
            'email': '@email',
            'datetime': '@datetime',
            'phone': '13888888888',
            'index|+1': 1,
            'id|+1': 1
          }
        ]
      }).array
      this.loading = false
    }, 1000)
  }
}
</script>
