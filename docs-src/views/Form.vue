<template>
  <div class="page-home page">
    <h2>Form 表单</h2>
    <section class="demo">
      <div class="section-content">
        <v-form ref="form" v-bind="formOptions" />
        <el-button type="primary" @click="validate">校 验</el-button>
        <el-button type="primary" @click="clearValidate">清除校验</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
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

    <h2>slot模式</h2>
    <section class="demo">
      <!-- <div class="section-content">
        <v-form ref="form1" :data="data">
          <v-form-item
            title="名字"
            prop="name"
            :span="8"
            :rules=" [
              { required: true },
              { min: 3 }
            ]"
          >
            <el-input v-model="data.name" />
          </v-form-item>
          <v-form-item
            title="性别"
            prop="sex"
            :span="8"
            :rules=" [
              { required: true, trigger: 'change' }
            ]"
          >
            <el-select v-model="data.sex" clearable>
              <el-option label="11" value="11" />
              <el-option label="22" value="22" />
            </el-select>
          </v-form-item>
        </v-form>
        <el-button type="primary" @click="validate1">校 验</el-button>
        <el-button type="primary" @click="clearValidate1">清除校验</el-button>
        <el-button type="primary" @click="save1">保 存</el-button>
      </div>
    </section> -->

      <section class="snippets">
        <Collapse>
          <div class="section-content">
            <CodeSnippet class="html" :code="htmlCode" />
            <CodeSnippet class="javascript" :code="jsCode" />
          </div>
        </Collapse>
      </section>
    </section></div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
// import mock from 'mockjs'

const jsCode = `
data () {
  return {
    formOptions: {
      // titleWidth: '100px',
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
            { required: true }
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
            { required: true }
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
}
`

const htmlCode = `
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
      data: {
        name: '',
        sex: '',
        age: '',
        heights: { height: '' },
        heightUnit: '1',
        weight: '',
        weightUnit: '1',
        hobby1: '',
        hobby2: '',
        hobby3: ''
      },
      formOptions: {
        // titleWidth: '100px',
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
            rules: [
              { min: 1, max: 3 }
            ]
          },

          {
            title: '身高',
            prop: 'heights.height.0.aaa',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { max: 3 }
            ],
            titlePrefix: { message: '帮助信息', icon: 'question' /* ooh | question*/}
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
            prop: 'weight.0.bbb',
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
    save() {
      this.$refs.form.clearStatus()
    },
    validate() {
      this.$refs.form.validate().catch(e => console.log(e))
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    save1() {
      this.$refs.form1.clearStatus()
    },
    validate1() {
      this.$refs.form1.validate().catch(e => console.log(e))
    },
    clearValidate1() {
      this.$refs.form1.clearValidate()
    }
  }
}
</script>
