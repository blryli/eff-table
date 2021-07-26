<template>
  <div class="page-home page">
    <h2>Form 高级表单</h2>
    <p class="hint">
      <span class="primary">formOptions</span> 配置整个表单<br>
    </p>
    <section class="demo">
      <div class="section-content">
        <p>
          <el-button type="primary" @click="validate">校 验</el-button>
          <el-button type="primary" @click="clearValidate">清除校验</el-button>
          <el-button type="primary" @click="resetFields">重置</el-button>
        </p>
        <v-form ref="form" v-bind="formOptions" />
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

    <p><span class="primary">render</span> 配置</p>
    <CodeSnippet class="javascript" :code="objCode" />

  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
// import mock from 'mockjs'
const objCode = `
  // column对象
  
  {
    itemRender: { // form-item配置render
      name: 'input', // 指定ui元素
      options: [], // select组件需要
      format: 'yyy-MM-dd', // 日期组件需要，如果没设置，则会取props里面的format
    },
  }
  `
const jsCode = `
export default {
  data() {
    return {
      formOptions: {
        columns: [
          {
            title: '名字',
            prop: 'name',
            span: 8,
            itemRender: { name: 'input' },
            rules: [
              { required: true },
              { min: 3 }
            ]
          },
          {
            title: '性别',
            prop: 'sex',
            span: 8,
            itemRender: {
              name: 'select',
              options: [{ value: '1', label: '男' }, { value: '2', label: '女' }]
            },
            rules: [
              { required: true, trigger: 'change' }
            ]
          },
          {
            title: '年龄',
            prop: 'age',
            span: 8,
            itemRender: { name: 'input' },
            titlePrefix: { message: '帮助信息', icon: 'question' },
            rules: [
              { min: 1, max: 3 }
            ]
          },

          {
            title: '身高',
            prop: 'height',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { max: 3 }
            ]
          },
          { prop: 'heightUnit',
            span: 5,
            itemRender: { name: 'select', options: [{ value: '1', label: 'cm' }, { value: '2', label: 'm' }] },
            rules: [
              { required: true, trigger: 'change' }
            ]
          },
          {
            title: '体重',
            prop: 'weight',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          },
          { prop: 'weightUnit',
            span: 5,
            itemRender: { name: 'select', options: [{ value: '1', label: 'kg' }, { value: '2', label: 'g' }] },
            rules: [
              { required: true, trigger: 'change' }
            ]
          },

          {
            title: '爱好',
            prop: 'hobby1',
            span: 10,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          },
          {
            prop: 'hobby2',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          },
          {
            prop: 'hobby3',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          }
        ]
      }
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate().catch(e => console.log(e))
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    resetFields() {
      this.$refs.form.resetFields()
    }
  }
}
`

const htmlCode = `
<p>
  <el-button type="primary" @click="validate">校 验</el-button>
  <el-button type="primary" @click="clearValidate">清除校验</el-button>
  <el-button type="primary" @click="resetFields">重置</el-button>
</p>
<v-form ref="form" v-bind="formOptions" />
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
      jsCode,
      htmlCode,
      objCode,
      formOptions: {
        columns: [
          {
            title: '名字',
            prop: 'name',
            span: 8,
            itemRender: { name: 'input' },
            rules: [
              { required: true },
              { min: 3 }
            ]
          },
          {
            title: '性别',
            prop: 'sex',
            span: 8,
            itemRender: {
              name: 'select',
              options: [{ value: '1', label: '男' }, { value: '2', label: '女' }]
            },
            rules: [
              { required: true, trigger: 'change' }
            ]
          },
          {
            title: '年龄',
            prop: 'age',
            span: 8,
            itemRender: { name: 'input' },
            titlePrefix: { message: '帮助信息', icon: 'question' },
            rules: [
              { min: 1, max: 3 }
            ]
          },

          {
            title: '身高',
            prop: 'height',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { max: 3 }
            ]
          },
          { prop: 'heightUnit',
            span: 5,
            itemRender: { name: 'select', options: [{ value: '1', label: 'cm' }, { value: '2', label: 'm' }] },
            rules: [
              { required: true, trigger: 'change' }
            ]
          },
          {
            title: '体重',
            prop: 'weight',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          },
          { prop: 'weightUnit',
            span: 5,
            itemRender: { name: 'select', options: [{ value: '1', label: 'kg' }, { value: '2', label: 'g' }] },
            rules: [
              { required: true, trigger: 'change' }
            ]
          },

          {
            title: '爱好',
            prop: 'hobby1',
            span: 10,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          },
          {
            prop: 'hobby2',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          },
          {
            prop: 'hobby3',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          }
        ]
      }
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate().catch(e => console.log(e))
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    resetFields() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
