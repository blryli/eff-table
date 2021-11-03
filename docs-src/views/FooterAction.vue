<template>
  <div class="page-home page">
    <h2>FooterAction 底部工具栏</h2>
    <p class="hint">
      底部工具栏分为左侧和右侧，左侧可以自定义按钮，右侧可以显示分页<br>
    </p>

    <h3>分页</h3>
    <p>
      <span class="primary">footerActionConfig.showPager = true</span><br>
      分页的当前页，每页大小，总大小由接口控制，接口的格式需要为<span class="primary">{pageNum pageSize total list}</span>
    </p>

    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :footer-action-config="{ showPager: true, showBorder: true }"
          :max-height="400"
        />
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

    <h3>左侧自定义render</h3>
    <p>
      <span class="primary">slot</span>名为<span class="primary">footer_action</span>的里面有内容<br>
    </p>

    <section class="demo">
      <div class="section-content">
        <eff-table ref="table2" v-model="columns" :data="data" :footer-action-config="footerActionConfig" :max-height="400">
          <template #footer_action>
            <el-button>演示按钮1</el-button>
            <el-button>演示按钮2</el-button>
            <el-button>演示按钮3</el-button>
            <el-button>演示按钮4</el-button>
          </template>
        </eff-table>
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
  <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    :footer-action-config="{ showPager: true, showBorder: true }"
  />
  `
const htmlCode1 = `
  <eff-table ref="table" v-model="columns" :data="data" :footer-action-config="{ }" :max-height="400" >
      <template #footer_action>
        <el-button>演示按钮1</el-button>
        <el-button>演示按钮2</el-button>
        <el-button>演示按钮3</el-button>
        <el-button>演示按钮4</el-button>
      </template>
    </eff-table>
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
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
        ]
      }
    },
    mounted() {
      this.$refs.table.pager = {
        pageNum: 1,
        pageSize: 10,
        total: 18
      }
    }
  }
  `
export default {
  name: 'FooterAction',
  components: {
    CodeSnippet,
    Collapse
  },
  data() {
    return {
      htmlCode,
      htmlCode1,
      jsCode,
      footerActionConfig: {
        showPager: true,
        showBorder: true,
        buttons: [
          { name: 'button', children: 'buttons1' },
          { name: 'button', children: 'buttons2' }
        ]
      },
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
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
      ]
    }
  },
  mounted() {
    this.$refs.table.pager = {
      pageNum: 1,
      pageSize: 10,
      total: 18
    }
  }
}
</script>
