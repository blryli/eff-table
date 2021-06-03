<template>
  <div class="page-home page">
    <h2>GroupColumn 树</h2>
    <p class="hint">
      树分为两种情况，同步和异步：<br>
      同步是在
      <span class="primary">v-model</span>的字段里 加入<span class="primary">children</span>字段
      <br>
      异步是在
      <span class="primary">v-model</span>的字段里 加入<span class="primary">hasChildren</span>字段，
      并且要提供一个<span class="primary">callback</span>给<span class="primary">proxy-config.request.loadChildren</span>
    </p>

    <section class="demo">
      <div class="section-content">
        <eff-table ref="table" v-model="columns" :data="data" :proxy-config="{request: {loadChildren}}" />
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

[
  {
    id: 1, index: 1, city: '城市1',
    children: [{
      id: 1, index: 1, city: '城市11'
    }]
  },
  {
    id: 1, index: 1, city: '城市2',
    children: [{
      id: 1, index: 1, city: '城市21', children: [{
        id: 1, index: 1, city: '城市211'
      }]
    }]
  },
  {
    id: 1, index: 1, city: '城市1', hasChildren: true
  }
]

const mainSnippet = `
 export default {
  data() {
    return {
      {id: 1, index: 1, city: '城市'， children: {id: 1, index: 1, city: '城市'}}
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
        }
      ]
    }
  },
  methods: {
    loadChildren(tree, resolve) {
      setTimeout(() => {
        resolve(mock.mock({
          'array|3': [{ 'city': '@city', 'index|+1': 1630, 'id|+1': 1630 }
          ]
        }).array)
      }, 1000)
    }
  }
}
`

const componentSnippet = `
  <eff-table ref="table" v-model="columns" :data="data" />
`
export default {
  name: 'GroupColumn',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      mainSnippet,
      componentSnippet,
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
        }
      ]
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.data = mock.mock({
        'array|3': [
          { 'city': '@city', 'index|+1': 1, 'id|+1': 1 }
        ]
      }).array
      this.loading = false

      this.data[0].children = mock.mock({
        'array|3': [
          { 'city': '@city', 'index|+1': 501, 'id|+1': 501 }
        ]
      }).array

      this.data[2].hasChildren = true
    }, 1000)
  },
  methods: {
    loadChildren(tree, resolve) {
      setTimeout(() => {
        resolve(mock.mock({
          'array|3': [{ 'city': '@city', 'index|+1': 1630, 'id|+1': 1630 }
          ]
        }).array)
      }, 1000)
    }
  }
}
</script>
