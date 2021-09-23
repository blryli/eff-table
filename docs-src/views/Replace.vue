<template>
  <div class="page-home page">
    <h2>Replace 批量替换</h2>
    <p class="hint">
      <span class="primary">show-replace</span>属性设置为
      <span class="primary"> true </span><br>
      点击按钮 <Icon icon="replace" /> 打开替换窗口，
      <span class="primary">右侧</span>拖动字段到<span class="primary">左侧</span>编辑替换的选项，点击确定进行替换
    </p>

    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :toolbar-config="{showReplace: true}"
          edit
          border
        />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="snippet" :code="htmlCode" lang="html" />
          <div class="plus">+</div>
          <CodeSnippet class="snippet" :code="jsCode" lang="js" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table ref="table" v-model="columns" :data="data" show-replace />
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
  name: 'Replace',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
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
          title: '名字',
          config: { name: 'input' },
          edit: true
        },
        {
          show: true,
          prop: 'sex',
          title: '性别',
          config: { name: 'select', options: [{ label: '男', value: '1' }, { label: '女', value: '2' }] },
          edit: true
        },
        {
          show: true,
          prop: 'phone',
          title: '手机',
          config: { name: 'input' },
          edit: true
        },
        {
          show: true,
          prop: 'date',
          title: '日期',
          config: { name: 'date-picker' },
          edit: true
        }
      ],
      data: [
        { name: '张三', sex: '男', phone: '', date: '2021-9-15' },
        { name: '李四', sex: '', phone: '13715201314', date: '2021-9-15' },
        { name: '', sex: '男', phone: '13715201314', date: '2021-9-15' },
        { name: '张三', sex: '女', phone: '13715201314', date: '2021-9-15' },
        { name: '张三', sex: '男', phone: '13715201314', date: '' },
        { name: '李四', sex: '男', phone: '13715201314', date: '2021-9-15' }
      ]
    }
  }
}
</script>
