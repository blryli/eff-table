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
      data: Object.freeze([]),
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      editStop: false,
      columns: [
        {
          show: true,
          type: 'index',
          title: '序号',
          width: 80,
          fixed: 'left'
        },
        {
          show: true,
          prop: 'message',
          title: '消息',
          width: 100
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          width: 120
        },
        {
          show: true,
          prop: 'email',
          title: '邮箱',
          width: 120,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input value={row.email} on-input={val => (row.email = val)} />
            }
          }
        },
        {
          show: true,
          prop: 'city',
          title: '城市',
          width: 120,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input value={row.city} on-input={val => (row.city = val)} />
            }
          }
        },
        {
          show: true,
          prop: 'datetime',
          title: '时间',
          width: 150,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input value={row.datetime} on-input={val => (row.datetime = val)} />
            }
          }
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = Object.freeze(mock.mock({
        'array|100': [
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
      }).array)
      console.log(this.data)
    }, 500)
  }
}
</script>
