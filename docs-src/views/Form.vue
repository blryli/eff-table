<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <v-form
          ref="form"
          v-bind="formOptions"
        />
        <v-form>
          <v-form-item title="aaa" :span="8">
            <el-input />
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
      formOptions: {
        // titleWidth: '100px',
        // data: {
        //   name: '',
        //   sex: '',
        //   age: '',
        //   height: '',
        //   heightUnit: '1',
        //   weight: '',
        //   weightUnit: '1',
        //   hobby1: '',
        //   hobby2: '',
        //   hobby3: ''
        // },
        cols: [
          {
            title: '名字',
            prop: 'name',
            span: 8,
            itemRender: { name: 'input' },
            rules: [{ required: true }]
          },
          {
            title: '性别',
            prop: 'sex',
            span: 8,
            itemRender: { name: 'select',
              options: [{ value: '1',
                label: '男' },
              { value: '2',
                label: '女' }] }
          },
          {
            title: '年龄',
            prop: 'age',
            span: 8,
            itemRender: { name: 'input' }
          },

          {
            title: '身高',
            prop: 'height',
            span: 7,
            itemRender: { name: 'input' },
            cascader: 'heightUnit'
          },
          { prop: 'heightUnit',
            span: 5,
            itemRender: { name: 'select',
              options: [{ value: '1',
                label: 'cm' },
              { value: '2',
                label: 'm' }] }
          },
          {
            title: '体重',
            prop: 'weight',
            span: 7,
            itemRender: { name: 'input' }
          },
          { prop: 'weightUnit',
            span: 5,
            itemRender: { name: 'select',
              options: [{ value: '1',
                label: 'kg' },
              { value: '2',
                label: 'g' }] }
          },

          {
            title: '爱好',
            prop: 'hobby1',
            span: 10,
            itemRender: { name: 'input' }
          },
          { prop: 'hobby2',
            span: 7,
            itemRender: { name: 'input' }
          },
          { prop: 'hobby3',
            span: 7,
            itemRender: { name: 'input' }}
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
  }
}
</script>
