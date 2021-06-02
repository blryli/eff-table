<template>
  <div class="page-home page">
    <h2>Base 基础表格</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table v-model="columns" :data="data" />
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
    <h2>Border 边框</h2>
    <p><span class="primary">border</span> 属性设置为<span class="primary"> true </span>显示竖边框</p>
    <section class="demo">
      <div class="section-content">
        <eff-table v-model="columns" :data="data" border />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode1" />
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
  <eff-table v-model="columns" :data="data" /> 
  `
const htmlCode1 = `
  <eff-table v-model="columns" :data="data" border /> 
  `

const jsCode = `
  export default {
    data() {
      return {
        data: [],
        columns: [
          {
            show: true,
            type: 'index',
            title: '序号',
            width: 80,
            fixed: 'left'
          },
          {
            show: true,
            prop: 'name',
            title: '名字'
          },
          {
            show: true,
            prop: 'sex',
            title: '性别'
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            width: 150
          }
        ]
      }
    }
  }
  `
export default {
  name: '',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      htmlCode1,
      jsCode,
      columns: [
        {
          show: true,
          type: 'index',
          width: 80,
          fixed: 'left'
        },
        {
          show: true,
          prop: 'name',
          title: '名字'
        },
        {
          show: true,
          prop: 'sex',
          title: '性别'
        },
        {
          show: true,
          prop: 'phone',
          title: '手机',
          width: 150
        }
      ],
      data: [
        { name: '张三', sex: '男', phone: '13715201314' },
        { name: '李四', sex: '男', phone: '13715201314' }
      ]
    }
  }
}
</script>
