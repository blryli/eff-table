<template>
  <div class="page-home page">
    <h2>Base 基础表格</h2>
    <p class="hint">
      基础属性<br>
      <span class="primary">value</span> 表格列数组<br>
      <span class="primary">data</span> 表格数据
    </p>
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

    <h3>竖边框</h3>
    <p><span class="primary">border</span> 属性设置为<span class="primary"> true </span>显示列竖边框</p>
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

    <h3>斑马线</h3>
    <p><span class="primary">stripe</span> 属性设置为<span class="primary"> true </span>显示列竖边框</p>
    <section class="demo">
      <div class="section-content">
        <eff-table v-model="columns" :data="data" stripe />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode2" />
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
const htmlCode2 = `
  <eff-table v-model="columns" :data="data" stripe /> 
  `

const jsCode = `
  export default {
    data() {
      return {
        columns: [
          {
            show: true,
            prop: 'id',
            title: 'ID'
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
            title: '手机'
          }
        ],
        data: [
          { id: 1, name: '张三', sex: '男', phone: '13715201314' },
          { id: 2, name: '李四', sex: '女', phone: '13715201314' },
          { id: 3, name: '王五', sex: '男', phone: '13715201314' },
          { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
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
      htmlCode2,
      jsCode,
      columns: [
        {
          show: true,
          prop: 'id',
          title: 'ID'
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
          title: '手机'
        },
        {
          show: true
        }
      ],
      data: [
        { id: 1, name: '张三', sex: '男', phone: '13715201314' },
        { id: 2, name: '李四', sex: '女', phone: '13715201314' },
        { id: 3, name: '王五', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
      ]
    }
  }
}
</script>
