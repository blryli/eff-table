<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :max-height="400"
          drag
          column-control
          border
          fullscreen
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
data () {
  return {
    msg: 'vue component'
  }
}
`

const componentSnippet = `
<eff-table
  ref="table"
  v-model="columns"
  :data="data"
  :max-height="400"
  drag
  column-control
  border
  fullscreen
/>
`
export default {
  name: '',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      value: 2,
      mainSnippet,
      componentSnippet,
      data: [],
      editStop: false,
      show: false,
      columns: [
        {
          show: true,
          type: 'selection',
          width: 80,
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
          width: 250
        },
        {
          show: true,
          prop: 'message',
          title: '消息',
          width: 250,
          edit: {
            render: (h, { row }) => {
              return <el-input {...{
                attrs: {
                  value: row.message
                },
                on: {
                  input: val => (row.message = val)
                }
              }} />
            }
          }
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          children: [{
            show: true,
            prop: 'xing',
            title: '姓',
            width: 150
          }, {
            show: true,
            prop: 'ming',
            title: '名',
            width: 150
          }]
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|1000': [
          {
            'message': '@email',
            'name': '@cname',
            'email': '@email',
            'city': '@city',
            'datetime': '@datetime',
            'index|+1': 1,
            long: ''
          }
        ]
      }).array
    }, 1000)
  }
}
</script>
