<template>
  <div class="page-home page">
    <h2>Description</h2>
    <el-button @click="$refs.table.sort('city', 'asc')">城市升序</el-button>
    <el-button @click="$refs.table.sort('city', 'desc')">城市降序</el-button>
    <el-button @click="$refs.table.clearSort()">清除排序</el-button>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :max-height="400"
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
  name: 'Sort',
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
          fixed: 'left',
          sortable: true
        },
        {
          show: true,
          prop: 'city',
          title: '城市',
          sortable: true
        },
        {
          show: true,
          prop: 'message',
          title: '消息',
          sortable: true
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
