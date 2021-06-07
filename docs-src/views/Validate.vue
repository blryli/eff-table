<template>
  <div class="page-home page">
    <h2>validate 校验</h2>
    <p class="hint">
      调用 <span class="primary"> validate </span> 函数校验数据，第一个参数为 true 时全量校验（如果不指定数据，则默认只校验临时变动的数据，例如新增或修改等）<br>
      列数据 <span class="primary"> rules </span> 配置校验规则
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :max-height="400"
          fullscreen
          edit
          border
        >
          <template slot="toolbar">
            <el-button @click="validate">校验</el-button>
            <el-button @click="validateChecked">校验选中行</el-button>
            <el-button @click="clearValidate">清除校验</el-button>
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

`

const componentSnippet = `

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
          type: 'selection',
          width: 80
        },
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
          rules: [{
            required: true,
            message: ''
          }]
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
          rules: [{ validator: ({ value }) => value < 50 && '年龄不能大于50' }]
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
          rules: [
            {
              validator: ({ value }) => new Promise(resolve => setTimeout(() => {
                resolve(value < 170 && '身高不能低于170')
              }, 1000))

            }

          ]
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.table.loadTableData(mock.mock({
        'array|8': [
          {
            'id|+1': 1,
            'name': function name() {
              return this.index % 5 === 0 ? '' : this.cname
            },
            'cname': '@cname',
            'age': /[1-7][0-9]/,
            'height': /1[5-9][0-9]/,
            'index|+1': 1
          }
        ]
      }).array)
    }, 50)
  },
  methods: {
    validate() {
      this.$refs.table.validate(true).then(res => {
        this.$message.success('校验通过!')
      }).catch(data => {
        this.$message.error('校验不通过!')
        console.log(JSON.stringify(data, null, 2))
      })
    },
    validateChecked() {
      const rows = this.$refs.table.getCheckRows()
      if (rows.length) {
        this.$refs.table.validate(rows).then(res => {
          this.$message.success('校验通过!')
        }).catch(data => {
          this.$message.error('校验不通过!')
          console.log(JSON.stringify(data, null, 2))
        })
      } else {
        this.$message.error('未选中行!')
      }
    },
    clearValidate() {
      this.$refs.table.clearValidate()
    }
  }
}
</script>
