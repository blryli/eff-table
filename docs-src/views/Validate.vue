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
data() {
  return {
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
            return <el-input value={row[prop]} on-input={val => (row[prop] = val)}></el-input>
          }
        },
        rules: {
          rule: ({ value }) => !value && '名字不能为空'
        }
      },
      {
        show: true,
        prop: 'age',
        title: '年龄 (大小校验)',
        edit: {
          render: (h, { prop, row }) => {
            return <el-input value={row[prop]} on-input={val => (row[prop] = val)}></el-input>
          }
        },
        rules: {
          required: true,
          rule: ({ value }) => value > 50 && '年龄不能大于50'
        }
      },
      {
        show: true,
        prop: 'height',
        title: '身高 (异步校验)',
        edit: {
          render: (h, { prop, row }) => {
            return <el-input value={row[prop]} on-input={val => (row[prop] = val)}></el-input>
          }
        },
        rules: {
          rule: ({ value }) => new Promise(resolve => setTimeout(() => {
            resolve(value < 170 && '身高不能低于170')
          }, 1000))
        }
      }
    ]
  }
},
methods: {
  validate() {
    this.$refs.table.validate().then(res => {
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
`

const componentSnippet = `
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
    <button @click="validateChecked">校验选中行</button>
    <button @click="clearValidate">清除校验</button>
  </template>
</eff-table>
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
          rules: [{ validator: ({ value }) => !value && '名字不能为空' }]
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
          rules: [{ validator: ({ value }) => value > 50 && '年龄不能大于50' }]
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
          rules: [{ validator: ({ value }) => new Promise(resolve => setTimeout(() => {
            resolve(value < 170 && '身高不能低于170')
          }, 1000)) }]
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
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
      }).array
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
