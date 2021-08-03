<template>
  <div class="page-home page">
    <h2>validate 校验</h2>
    <p class="hint">
      调用 <span class="primary"> validate </span> 函数校验数据，第一个参数为 true 时全量校验（如果不指定数据，则默认只校验临时变动的数据，例如新增或修改等）<br>
      列数据 <span class="primary"> rules </span> 配置校验规则<br>
      编辑时会进行实时校验<br>
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-bind="tableOptions"
        >
          <template slot="toolbar">
            <el-button @click="validate">校验</el-button>
            <el-button @click="validateChecked">校验选中行</el-button>
            <el-button @click="fullValidate">全量校验</el-button>
            <el-button @click="clearValidate">清除校验</el-button>
          </template>
        </eff-table>
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>
    <CodeSnippet class="javascript" :code="rules" />
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table
    ref="table"
    v-bind="tableOptions"
  >
    <template slot="toolbar">
      <el-button @click="validate">校验</el-button>
      <el-button @click="validateChecked">校验选中行</el-button>
      <el-button @click="fullValidate">全量校验</el-button>
      <el-button @click="clearValidate">清除校验</el-button>
    </template>
  </eff-table>
  `

const rules = `
  rules: [ // 校验规则
    {
      required: true, 
      message: '', //可选，默认为 不能为空 
      trigger: '' // 可选，默认为 blur，对于select组件必须声明为 change
    }, 
    {
      min: number, // 最小长度
      message: '', //可选，默认为 长度不能小于 min
    }, 
    {
      max: number, // 最大长度 
      message: '', //可选，默认为 长度不能大于 max
    }, 
    // min,max同时存在时 message 默认为 长度必须在 min 到 max 
    {
      pattern: reg, // 正则
      message: '', //可选，默认为 校验不通过
    }, 
    {
      type: 'email', // 邮箱
      message: '', //可选，默认为 请输入正确的邮箱
    }, 
    {
      type: 'phone', // 手机号
      message: '', //可选，默认为 请输入正确的手机号
    }, 
    {
      validator: Function ({value, row, column, id, prop}) // 自定义校验，支持异步
    }
  ]
  `
const jsCode = `
  export default {
    data() {
      return {
        tableOptions: {
          maxHeight: 400,
          edit: true,
          border: true,
          columns: [
            {
              show: true,
              type: 'selection',
              width: 60
            },
            {
              show: true,
              prop: 'name',
              title: '名字',
              titleSuffix: { icon: 'info', message: '异步操作，等待回调完成再进行下一步操作' },
              sortable: true,
              edit: {
                render: { props: { placeholder: '请输入刘德华' }}
              },
              rules: [
                { required: true },
                { min: 2, max: 5 },
                { validator: ({ value }) => new Promise(resolve => {
                // 模拟远程校验
                  return setTimeout(() => resolve(value === '刘德华' ? '该名称已被作者使用，请换其他名字' : ''), 200)
                }) }
              ]
            },
            {
              show: true,
              prop: 'sex',
              title: '性别',
              config: { name: 'select', options: [{ label: '男', value: '1' }, { label: '女', value: '2' }] },
              edit: true,
              rules: [{ required: true }]
            },
            {
              show: true,
              prop: 'phone',
              title: '手机',
              edit: true,
              rules: [{ type: 'phone' }]
            },
            {
              show: true,
              prop: 'email',
              title: '邮箱',
              edit: true,
              rules: [{ type: 'email' }]
            }
          ],
          data: [
            { id: 1, name: '张三', sex: '男', phone: '1371520', email: '168@qq.com' },
            { id: 2, name: '李四', sex: '女', phone: '13715201314', email: '168@qq.com' },
            { id: 3, name: '刘德华', sex: '', phone: '137152013141371520131413715201314137152013141371520', email: '168@qq.com' },
            { id: 4, name: '赵六', sex: '男', phone: '13715201314', email: '168168168168168168168168168168168168168168168168168168' }
          ]
        }
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
      fullValidate() {
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
  `
export default {
  name: 'Validate',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      rules,
      tableOptions: {
        maxHeight: 400,
        edit: true,
        border: true,
        columns: [
          {
            show: true,
            type: 'selection',
            width: 60
          },
          {
            show: true,
            prop: 'name',
            title: '名字',
            titleSuffix: { icon: 'info', message: '异步操作，等待回调完成再进行下一步操作' },
            sortable: true,
            edit: {
              render: { props: { placeholder: '请输入刘德华' }}
            },
            rules: [
              { required: true },
              { min: 2, max: 5 },
              { validator: ({ value }) => new Promise(resolve => {
              // 模拟远程校验
                return setTimeout(() => resolve(value === '刘德华' ? '该名称已被作者使用，请换其他名字' : ''), 200)
              }) }
            ]
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            config: { name: 'select', options: [{ label: '男', value: '1' }, { label: '女', value: '2' }] },
            edit: true,
            rules: [{ required: true }]
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            edit: true,
            rules: [{ type: 'phone' }]
          },
          {
            show: true,
            prop: 'email',
            title: '邮箱',
            edit: true,
            rules: [{ type: 'email' }]
          }
        ],
        data: [
          { id: 1, name: '张三', sex: '男', phone: '1371520', email: '168@qq.com' },
          { id: 2, name: '李四', sex: '女', phone: '13715201314', email: '168@qq.com' },
          { id: 3, name: '刘德华', sex: '', phone: '137152013141371520131413715201314137152013141371520', email: '168@qq.com' },
          { id: 4, name: '赵六', sex: '男', phone: '13715201314', email: '168168168168168168168168168168168168168168168168168168' }
        ]
      }
    }
  },
  methods: {
    validate() {
      this.$refs.table.validate().then(res => {
        this.$message.success('校验通过!')
      }).catch(data => {
        this.$message.error('校验不通过!')
        // console.log(JSON.stringify(data, null, 2))
      })
    },
    fullValidate() {
      this.$refs.table.validate(true).then(res => {
        this.$message.success('校验通过!')
      }).catch(data => {
        this.$message.error('校验不通过!')
        // console.log(JSON.stringify(data, null, 2))
      })
    },
    validateChecked() {
      const rows = this.$refs.table.getCheckRows()
      if (rows.length) {
        this.$refs.table.validate(rows).then(res => {
          this.$message.success('校验通过!')
        }).catch(data => {
          this.$message.error('校验不通过!')
          // console.log(JSON.stringify(data, null, 2))
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
