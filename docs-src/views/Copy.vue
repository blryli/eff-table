<template>
  <div class="page-home page">
    <h2>Copy 复制粘贴</h2>
    <p class="hint">
      前置条件<br>
      <span class="primary">copy</span> 属性设置为
      <span class="primary"> true </span><br>
    </p>
    <p>
      可以通过<span class="primary">ctrl+c</span>复制，<span class="primary">ctrl+v</span>粘贴，也可以选择一块区域后点击<span class="primary">右下角图标</span>进行复制
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          v-model="columns"
          :data="data"
          :max-height="400"
          border
          copy
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
  <eff-table v-model="columns" :data="data" copy /> 
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
  name: 'Copy',
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

<style lang="scss">
.eff-table .cell .el-radio__label{
  display: none;
}
.table-toobar__left{
  button{
    padding: 5px 10px;
    border: 1px solid #ddd;
    background-color: #fff;
    cursor: pointer;
    &:hover, &:focus{
      border-color: #ccc;
      background-color: #f5f5f5;
    }
    &:active{
      border-color: #aaa;
      background-color: #f5f5f5;
    }
  }
}
</style>
