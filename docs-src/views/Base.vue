<template>
  <div class="page-home page">
    <h2>Base 基础表格</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          v-model="columns"
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
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const mainSnippet = `
data() {
  return {
    data: [],
    columns: [
      
    ]
  }
}
`

const componentSnippet = `
<eff-table
  v-model="columns"
  :data="data"
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
        },
        {
          show: true,
          prop: 'name',
          title: '名字'
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
}
</script>
