<template>
  <div class="page-home page">
    <h2>Sort 排序</h2>
    <p class="hint">
      单字段排序<br>
      设置v-model字段的
      <span class="primary">sortable</span>属性 = <span class="primary">true</span> 开启
    </p>
    <div>
      也可以通过组件的sort方法去排序，参数为（字段名，"asc" || "desc"）
    </div>
    <br>

    <!-- <section class="demo">
      <div class="section-content">
        <eff-table ref="table" v-bind="tableOptions">
          <template slot="toolbar">
            <el-button @click="$refs.table.sort('age', 'asc')">年龄升序</el-button>
            <el-button @click="$refs.table.sort('age', 'desc')">年龄降序</el-button>
            <el-button @click="$refs.table.clearSort()">清除排序</el-button>
          </template>
        </eff-table>
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
    </section> -->

    <p class="hint">
      多字段排序<br>
      设置
      <span class="primary">multiple-sort</span> = <span class="primary">true</span> 开启
    </p>
    <div>
      点击
      <div title="自定义排序" style="display: inline-flex" class="eff-table__sort flex justify-between"><div class="eff-table__sort-left" /> <div class="eff-table__sort-right" /></div>
      展开排序框，在<span class="primary">右侧</span>选择字段后，点击<span class="primary">左侧</span>选择排序方式，点击确定即可执行排序
    </div>
    <br>

    <section class="demo">
      <div class="section-content">
        <eff-table v-bind="tableOptions1" />
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

const mainSnippet = `
data () {
  return {
    data: [],
    columns: [
      {
        show: true,
        type: 'selection',
        width: 80,
        fixed: 'left'
      },
      {
        show: true,
        prop: 'index',
        title: '序号',
        width: 80,
        fixed: 'left',
        sortable: true
      },
      {
        show: true,
        prop: 'city',
        title: '城市',
        sortable: true
      },
      {
        show: true,
        prop: 'message',
        title: '消息',
        sortable: true
      }
    ]
  }
}
`

const componentSnippet = `
<eff-table
  ref="table"
  v-model="columns"
  :data="data"
  multiple-sort
/>
`
export default {
  name: 'Sort',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      value: 2,
      mainSnippet,
      componentSnippet,
      tableOptions: {
        maxHeight: 400,
        border: true,
        data: [
          { name: '张三', xing: '张', ming: '三', sex: '男', age: '20' },
          { name: '李四', xing: '李', ming: '四', sex: '男', age: '28' },
          { name: '张三', xing: '张', ming: '三', sex: '男', age: '28' },
          { name: '王五', xing: '王', ming: '五', sex: '男', age: '28' },
          { name: '张三', xing: '张', ming: '三', sex: '女', age: '20' },
          { name: '小丽', xing: '小', ming: '丽', sex: '女', age: '18' }
        ],
        columns: [
          {
            show: true,
            type: 'selection',
            width: 80,
            fixed: 'left'
          },
          {
            show: true,
            prop: 'name',
            title: '名字',
            width: 80,
            fixed: 'left',
            sortable: true
            // children: [
            //   { prop: 'xing', title: '姓', sortable: true, children: [
            //     { prop: 'zhong', title: '中文', sortable: true },
            //     { prop: 'ying', title: '英文', sortable: true }
            //   ] },
            //   { prop: 'ming', title: '名', sortable: true }
            // ]
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            sortable: true
          },
          {
            show: true,
            prop: 'age',
            title: '年龄',
            sortable: true
          }
        ]
      },
      tableOptions1: {
        maxHeight: 400,
        border: true,
        sortConfig: { multiple: true },
        toolbarConfig: { batchSort: true },
        data: [
          { name: '张三', xing: '张', ming: '三', sex: '男', age: '20' },
          { name: '李四', xing: '李', ming: '四', sex: '男', age: '28' },
          { name: '张三', xing: '张', ming: '三', sex: '男', age: '28' },
          { name: '王五', xing: '王', ming: '五', sex: '男', age: '28' },
          { name: '张三', xing: '张', ming: '三', sex: '女', age: '20' },
          { name: '小丽', xing: '小', ming: '丽', sex: '女', age: '18' }
        ],
        columns: [
          {
            show: true,
            type: 'selection',
            width: 80,
            fixed: 'left'
          },
          {
            show: true,
            prop: 'name',
            title: '名字',
            width: 80,
            fixed: 'left',
            sortable: true
            // children: [
            //   { prop: 'xing', title: '姓', sortable: true, children: [
            //     { prop: 'zhong', title: '中文', sortable: true },
            //     { prop: 'ying', title: '英文', sortable: true }
            //   ] },
            //   { prop: 'ming', title: '名', sortable: true }
            // ]
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            sortable: true
          },
          {
            show: true,
            prop: 'age',
            title: '年龄',
            sortable: true
          }
        ]
      }
    }
  }
}
</script>
