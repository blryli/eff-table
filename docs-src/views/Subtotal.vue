<template>
  <div class="page-home page">
    <h2>Subtotal 小计</h2>
    <p class="hint">
      toolbarConfig 配置中 <span class="primary"> subtotal </span> 属性设置 <span class="primary"> true </span>，显示小计功能图标
      <icon icon="subtotal" /><br>
      row数据中有 <span class="primary"> subtotal </span> 对象，则会标记为小计行<br>
      按住<span class="primary"> ctrl + 单击行 </span>选择列，支持多选
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-bind="tableOptions"
        />
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
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table
    ref="table"
    v-bind="tableOptions"
  />
  `
const jsCode = `
  
  `
export default {
  name: 'Subtotal',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      tableOptions: {
        maxHeight: 400,
        edit: true,
        border: true,
        toolbarConfig: { subtotal: true },
        columns: [
          {
            show: true,
            prop: 'name',
            title: '名字',
            titleSuffix: { icon: 'info', message: '异步操作，等待回调完成再进行下一步操作' }
          },
          {
            show: true,
            prop: 'number',
            title: '数量'
          },
          {
            show: true,
            prop: 'email',
            title: '邮箱'
          }
        ],
        data: [
          { id: 1, name: '99', number: '12', email: '168@qq.com' },
          { id: 2, name: '888', number: '33', email: '168@qq.com' },
          { id: 5, name: '999999', number: '6', email: '1681681681681' },
          { id: 3, name: '9999', number: '22', email: '168@qq.com' },
          { id: 5, name: '999999', number: '8', email: '1681681681681' },
          { id: 4, name: '888', number: '33', email: '168@qq.com' },
          { id: 5, name: '777', number: '6', email: '1681681681681' }
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
