<template>
  <div class="page-home page">
    <h2>Form 快捷编辑 <router-link class="page-router" to="/FormApi">查看api</router-link></h2>
    <p class="hint">
      快捷编辑，旨在尽量让用户脱离鼠标进行编辑，快捷键
      <el-tag class="ml-10">enter</el-tag> 右
      <el-tooltip effect="dark" content="聚焦后一个可编辑元素，在最后一个可编辑元素按下enter时，进行循环编辑" placement="top">
        <i class="el-icon el-icon-question" />
      </el-tooltip>
      <el-tag class="ml-20">shift</el-tag> + <el-tag>enter</el-tag> 左
      <el-tooltip effect="dark" content="聚焦前一个可编辑元素，在第一个可编辑元素按下shift+enter时，进行循环编辑" placement="top">
        <i class="el-icon el-icon-question" />
      </el-tooltip><br>
    </p>
    <section class="demo">
      <div class="section-content">
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

  </div>
</template>

<script>
import CodeSnippet from '../../components/CodeSnippet.vue'
import Collapse from '../../components/Collapse.vue'
// import mock from 'mockjs'

const jsCode = `
  export default {
    data () {
      return {
        formOptions: {
          columns: [
            {
              title: '名字',
              prop: 'name',
              span: 8
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
              span: 8,
              itemRender: { name: 'input' },
              titlePrefix: { message: '帮助信息', icon: 'question' }
            },
            {
              title: '体重',
              prop: 'weight.0.bbb',
              span: 8,
              itemRender: { name: 'input' },
              rules: [
                { required: true }
              ]
            },

            {
              title: '爱好',
              prop: 'hobby1',
              span: 6,
              itemRender: { name: 'input' }
            },
            {
              prop: 'hobby2',
              span: 5,
              itemRender: { name: 'input' }
            },
            {
              prop: 'hobby3',
              span: 5,
              itemRender: { name: 'input' }
            }
          ]
        }
      }
    }
  }
  `

const htmlCode = `
  <v-form ref="form" v-bind="formOptions" />
  `
export default {
  name: 'FormEdit',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      value: 2,
      jsCode,
      htmlCode,
      formOptions: {
        columns: [
          {
            title: '名字',
            prop: 'name',
            span: 8
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
            span: 8,
            itemRender: { name: 'input' },
            titlePrefix: { message: '帮助信息', icon: 'question' }
          },
          {
            title: '体重',
            prop: 'weight.0.bbb',
            span: 8,
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          },

          {
            title: '爱好',
            prop: 'hobby1',
            span: 6,
            itemRender: { name: 'input' }
          },
          {
            prop: 'hobby2',
            span: 5,
            itemRender: { name: 'input' }
          },
          {
            prop: 'hobby3',
            span: 5,
            itemRender: { name: 'input' }
          }
        ]
      }
    }
  }
}
</script>
