<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <v-form
          ref="form"
          v-bind="formOptions"
        />
        <el-button type="primary" @click="validate">校 验</el-button>
        <el-button type="primary" @click="clearValidate">清除校验</el-button>
        <el-button type="primary" @click="save">保 存</el-button>

        <v-form :data="data">
          <v-form-item
            title="名字"
            prop="name"
            :span="8"
            :rules=" [
              { type: 'phone' }
            ]"
          >
            <el-input v-model="data.name" />
          </v-form-item>
          <v-form-item
            title="select"
            prop="select"
            :span="8"
            :rules=" [
              { required: true, trigger: 'change' }
            ]"
          >
            <el-select v-model="data.select" clearable>
              <el-option label="11" value="11" />
              <el-option label="22" value="22" />
            </el-select>
          </v-form-item>
        </v-form>
        <!-- {{ formOptions.data }} -->
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
// import mock from 'mockjs'

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
      input: '',
      data: {
        name: '',
        sex: '',
        age: '',
        height: '',
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
            prop: 'height',
            span: 7,
            itemRender: { name: 'input' },
            rules: [
              { max: 3 }
            ]
          },
          { prop: 'heightUnit',
            span: 5,
            itemRender: { name: 'select',
              options: [{ value: '1',
                label: 'cm' },
              { value: '2',
                label: 'm' }] },
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
            itemRender: { name: 'select',
              options: [{ value: '1',
                label: 'kg' },
              { value: '2',
                label: 'g' }] },
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
  },
  mounted() {
    setTimeout(() => {
      // this.data = mock.mock({
      //   'array|1000': [
      //     {
      //       'id|+1': 100,
      //       'message': '@email',
      //       'name': '@cname',
      //       'email': '@email',
      //       'city': '@city',
      //       'datetime': '@datetime',
      //       'index|+1': 1,
      //       long: ''
      //     }
      //   ]
      // }).array
    }, 1000)
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
    }
  }
}
</script>
