<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <v-form
          ref="form"
          v-bind="formOptions"
        />
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
        titleWidth: '100px',
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
          { title: '名字', span: 8, prop: 'name' },
          { span: 8, prop: 'sex', itemRender: { name: 'select', options: [{ value: '1', label: '男' }, { value: '2', label: '女' }] }},
          { title: '年龄', span: 8, prop: 'age' },
          { title: '身高', span: 12, children: [
            { prop: 'height', span: 12 },
            { prop: 'heightUnit', span: 12, itemRender: { name: 'select', options: [{ value: '1', label: 'cm' }, { value: '2', label: 'm' }] }}
          ] },
          { title: '体重', span: 12, children: [
            { prop: 'weight', span: 12 },
            { prop: 'weightUnit', span: 12, itemRender: { name: 'select', options: [{ value: '1', label: 'kg' }, { value: '2', label: 'g' }] }}
          ] },
          { title: '爱好', span: 16, children: [
            { prop: 'hobby1', span: 8 },
            { prop: 'hobby2', span: 8 },
            { prop: 'hobby3', span: 8 }
          ] }
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
