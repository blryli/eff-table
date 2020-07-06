<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          fullscreen
          border
          :height="400"
          :data="data"
        >
          <template slot="toolbar">
            <button @click="() => $refs.table.validate(val => val)">校验</button>
            <button @click="() => $refs.table.clearValidate()">清除校验</button>
          </template>
        </eff-table>
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
<v-component :msg="msg" />
`
export default {
  name: 'Validate',
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
          type: 'index',
          title: '序号',
          width: 80
        },
        {
          show: true,
          prop: 'email',
          title: '邮箱',
          width: 100,
          validator: {
            rule: val => new Promise(resolve => setTimeout(() => {
              resolve(val.length > 10 && '邮箱长度不能大于10')
            }, 1000))
          }
        },
        {
          show: true,
          prop: 'city',
          title: '城市',
          width: 100,
          validator: {
            rule: val => !val && '城市不能为空'
          }
        },
        {
          show: true,
          prop: 'datetime',
          title: '时间',
          width: 100
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|100': [
          {
            'email': '@email',
            'city': '',
            'datetime': '@datetime',
            'index|+1': 1
          }
        ]
      }).array
      console.log(this.data)
    }, 50)
  },
  methods: {

  }
}
</script>
