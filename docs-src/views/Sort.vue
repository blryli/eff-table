<template>
  <div class="page-home page">
    <h2>Sort 排序</h2>
    <p class="hint">
      单字段排序<br>
      设置v-model字段的
      <span class="primary">sortable</span>属性 = <span class="primary">true</span> 开启排序<br>
      可以通过 <span class="primary">sort(prop, 'asc' || 'desc')</span> 方法进行排序<br>
      也可以通过 <span class="primary">toggleSort(prop)</span> 方法进行循环排序，循环顺序为<span class="primary">['desc', 'asc', '']</span><br>
    </p>

    <section class="demo">
      <div class="section-content">
        <eff-table ref="table" v-bind="tableOptions" @sort-change="sortChange">
          <template slot="toolbar">
            <el-button @click="$refs.table.sort('name', 'asc')">名字升序</el-button>
            <el-button @click="$refs.table.sort('name', 'desc')">名字降序</el-button>
            <el-button @click="$refs.table.toggleSort('name')">名字循环切换</el-button>
            <el-button @click="$refs.table.clearSort()">清除排序</el-button>
          </template>
        </eff-table>
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

    <p class="hint">
      多字段排序<br>
      设置
      <span class="primary">multiple-sort</span> = <span class="primary">true</span> 开启
    </p>
    <!-- <div>
      点击
      <div title="自定义排序" style="display: inline-flex" class="eff-table__sort flex justify-between"><div class="eff-table__sort-left" /> <div class="eff-table__sort-right" /></div>
      展开排序框，在<span class="primary">右侧</span>选择字段后，点击<span class="primary">左侧</span>选择排序方式，点击确定即可执行排序
    </div> -->

    <section class="demo">
      <div class="section-content">
        <eff-table v-bind="tableOptions1" @sort-change="sortChange" />
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
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const jsCode = `
  export default {
    data () {
      return {
        data: [],
        columns: [
          {
            show: true,
            prop: 'index',
            title: '序号',
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
  }
  `

const htmlCode = `
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
      jsCode,
      htmlCode,
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
            prop: 'name',
            title: '名字',
            titleSort: true,
            sortable: true
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
            prop: 'name',
            title: '名字',
            sortable: true
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
  },
  methods: {
    sortChange(val) {
      console.log('sorts', JSON.stringify(val, null, 2))
    }
  }
}
</script>
