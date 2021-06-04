<template>
  <div class="page-home page">
    <h2>Sort 排序</h2>
    <p class="hint">
      单字段排序<br>
      设置v-model字段的
      <span class="primary">sortable</span>属性 = <span class="primary">true</span> 开启
    </p>
    <div>
      也可以通过组件的sort方法去排序，参数为（字段名，"asc" || "desc"）
    </div>
    <br>

    <el-button @click="$refs.table.sort('city', 'asc')">城市升序</el-button>
    <el-button @click="$refs.table.sort('city', 'desc')">城市降序</el-button>
    <el-button @click="$refs.table.clearSort()">清除排序</el-button>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :max-height="400"
          :data="data"
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

    <p class="hint">
      全字段排序<br>
      设置
      <span class="primary">show-sort</span> = <span class="primary">true</span> 开启
    </p>
    <div>
      点击
      <div title="自定义排序" style="display: inline-flex" class="eff-table__sort flex justify-between"><div class="eff-table__sort-left" /> <div class="eff-table__sort-right" /></div>
      展开排序框，在<span class="primary">右侧</span>选择字段后，点击<span class="primary">左侧</span>选择排序方式，点击确定即可执行排序
    </div>
    <br>

    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :max-height="400"
          :data="data"
          fullscreen
          show-sort
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
    data: [],
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
}
`

const componentSnippet = `
<eff-table
  ref="table"
  v-model="columns"
  :data="data"
  show-sort
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
            'id|+1': 100,
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
