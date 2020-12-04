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
        >
          <template slot="toolbar">
            <button @click="validate">校验</button>
            <button @click="validateRow">校验第3行</button>
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
          fixed: 'left',
          type: 'index',
          title: '序号',
          width: 80
        },
        {
          show: true,
          prop: 'name',
          title: '名字 (空值校验)',
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
            }
          },
          validator: {
            rule: ({ value }) => !value && '名字不能为空'
          }
        },
        {
          show: true,
          prop: 'age',
          title: '年龄 (大小校验)',
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
            }
          },
          validator: {
            rule: ({ value }) => value > 50 && '年龄不能大于50'
          }
        },
        {
          show: true,
          prop: 'height',
          title: '身高 (异步校验)',
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
            }
          },
          validator: {
            rule: ({ value }) => new Promise(resolve => setTimeout(() => {
              resolve(value < 170 && '身高不能低于170')
            }, 1000))
          }
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|8': [
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
  },
  methods: {
    validate() {
      this.$refs.table.validate(val => {
        val ? this.$message.success('校验通过!') : this.$message.error('校验不通过!')
      })
    },
    validateRow() {}
  }
}
</script>
