<template>
  <div class="page-home page">
    <h2>Description</h2>
    <el-button @click="$refs.table.sort('city', 'asc')">城市升序</el-button>
    <el-button @click="$refs.table.sort('city', 'desc')">城市降序</el-button>
    <el-button @click="$refs.table.clearSort()">清除排序</el-button>
    <section class="demo">
      <div class="section-content">
        <v-form
          ref="form"
          v-bind="formOptions"
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

  }
}
`

const componentSnippet = `

`
export default {
  name: 'Form',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      value: 2,
      mainSnippet,
      componentSnippet,
      formOptions: {
        data: {},
        layer: [],
        cols: [
          { label: 'aaa', span: 8 },
          { label: 'bbb', span: 16 }
        ]
      }
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
