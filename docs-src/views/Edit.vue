<template>
  <div class="page-home page">
    <h2>Edit 编辑</h2>
    <p class="hint">
      前置条件：
      <span class="primary">edit</span> 属性设置为
      <span class="primary"> true </span><br>
      编辑用的是唯一的悬浮框，对比旧方式性能高。<br>
      旨在尽量让用户脱离鼠标对表格进行快速编辑，快捷键
      <el-tag class="ml-10">enter</el-tag> 右
      <el-tooltip effect="dark" content="聚焦右侧可编辑单元格，在当前行最后一个可编辑单元格按下enter时，自动聚焦下一行第一个可编辑单元格" placement="top">
        <i class="el-icon el-icon-question" />
      </el-tooltip>
      <el-tag class="ml-20">shift</el-tag> + <el-tag>enter</el-tag> 左
      <el-tooltip effect="dark" content="聚焦左侧可编辑单元格，在当前行第一个可编辑单元格按下shift+enter时，自动聚焦上一行第一个可编辑单元格" placement="top">
        <i class="el-icon el-icon-question" />
      </el-tooltip>
      <el-tag class="ml-20">arrowup</el-tag> 上
      <el-tooltip effect="dark" content="聚焦当前列上方可编辑单元格，在顶部按下 arrowup 时，有触顶提示" placement="top">
        <i class="el-icon el-icon-question" />
      </el-tooltip>
      <el-tag class="ml-20">arrowdown</el-tag> 下
      <el-tooltip effect="dark" content="聚焦当前列下方可编辑单元格，在底部按下 arrowdown 时，有触底提示" placement="top">
        <i class="el-icon el-icon-question" />
      </el-tooltip>
    </p>
    <p>列 <span class="primary">edit</span> 属性设置为
      <span class="primary"> true </span>，该列表头会显示可编辑列&nbsp;<i class="eff-icon-edit" title="可编辑列" />&nbsp;图标，默认渲染成 input 编辑框
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          edit
          border
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

    <h3>对象模式</h3>
    <p>cellRender 决定展示内容，配置列 <span class="primary">config</span>，通过设置 <span class="primary">name</span> 指定渲染元素，</p>config 作用于 cellRender 及 edit 对象的 render 对象
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns1"
          :data="data1"
          :max-height="400"
          edit
          border
        />
      </div>
    </section>
    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode1" />
          <CodeSnippet class="javascript" :code="jsCode1" />
        </div>
      </Collapse>
    </section>

    <h3>render函数模式</h3>
    <p>列 <span class="primary">edit</span> 为render函数时，通过设置 <span class="primary">name</span> 指定渲染元素。元素有下拉框时，需要设置 table 的 edit-stop 属性</p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :max-height="400"
          edit
          :edit-stop="editStop"
          border
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
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
import mock from 'mockjs'
import { formatDate } from '@/utils'

const htmlCode = `
  <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    edit
    border
  />
  `
const htmlCode1 = `
  <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    :max-height="400"
    edit
    :edit-stop="editStop"
    border
  />
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
            title: '名字',
            edit: true
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            edit: true
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            edit: true
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
const jsCode1 = `
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
            title: '名字',
            edit: true
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            edit: true
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            edit: true
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
  name: 'Edit',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      htmlCode1,
      jsCode,
      jsCode1,
      options: [{
        value: '选项1',
        label: '1'
      }, {
        value: '选项2',
        label: '2'
      }],
      editStop: false,
      columns: [
        {
          show: true,
          prop: 'id',
          title: 'ID'
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          edit: true
        },
        {
          show: true,
          prop: 'sex',
          title: '性别',
          edit: true
        },
        {
          show: true,
          prop: 'phone',
          title: '手机',
          edit: true
        }
      ],
      columns1: [
        {
          show: true,
          prop: 'id',
          title: 'ID'
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          edit: {
            render: { name: 'input' }
          }
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
          edit: true
        }
      ],
      data: [
        { id: 1, name: '张三', sex: '男', phone: '13715201314' },
        { id: 2, name: '李四', sex: '女', phone: '13715201314' },
        { id: 3, name: '王五', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
      ],
      data1: [
        { id: 1, name: '张三', sex: '1', phone: '13715201314' },
        { id: 2, name: '李四', sex: '2', phone: '13715201314' },
        { id: 3, name: '王五', sex: '1', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '1', phone: '13715201314' }
      ],
      columns2: [
        {
          show: true,
          type: 'index',
          title: '序号',
          width: 60
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          config: {
            defaultValue: '123'
          },
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} placeholder='number' on-input={val => (row[prop] = val)} />
            }
          }
        },
        {
          show: true,
          prop: 'async',
          titleRender: (h, { column }) => {
            return ['异步处理', <el-tooltip class='item' effect='dark' content='当前单元格的值为异步取值，且被后面的值依赖时必用' placement='top'>
              <i class='el-icon el-icon-question' />
            </el-tooltip>]
          },
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} placeholder='number' on-input={val => (row[prop] = val)} />
            },
            leaveTime: ({ prop, row }) => {
              return new Promise(resolve => {
                setTimeout(() => resolve(), row[prop] || 0)
              })
            }
          }
        },
        {
          show: true,
          prop: 'switch',
          titleRender: (h, { column }) => {
            return ['开关', <el-tooltip class='item' effect='dark' content='控制动态skip：有值打开，没值禁用' placement='top'>
              <i class='el-icon el-icon-question' />
            </el-tooltip>]
          },
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
            }
          }
        },
        {
          show: true,
          prop: 'dynamic',
          title: '动态skip',
          edit: {
            render: (h, { prop, row }) => {
              return <el-input
                value={row[prop]}
                disabled={!row.switch}
                on-input={val => (row[prop] = val)}
              />
            },
            skip: ({ row }) => !row.switch
          }
        },
        {
          show: true,
          prop: 'select',
          title: '选择器',
          options: [{ label: 1, value: 2 }],
          config: {
            optionsFunc: this.asdf,
            options: []
          },
          edit: {
            render: {
              cascade: true,
              cascadeCol: 'name',
              name: 'select'
            }
          }
        },
        {
          show: true,
          prop: 'date',
          title: '日期',
          cellRender: (h, { prop, row }) => {
            return formatDate(row[prop], 'yyyy-MM-dd')
          },
          edit: {
            render: (h, { prop, row }) => {
              return <el-date-picker
                value={row[prop]}
                on-input={val => (row[prop] = val)}
                on-focus={val => this.visibleChange(true)}
                on-blur={val => this.visibleChange(false)}
                type='date'
              />
            }
          }
        },
        {
          show: true,
          prop: 'end',
          title: '回车编辑下一行',
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
            }
          }
        }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    visibleChange(val) {
      this.editStop = val
    },
    getData() {
      this.data2 = mock.mock({
        'array|2': [
          {
            'id|+1': 1,
            'name': '@cname',
            'async': '',
            'select': '',
            'date': '',
            'switch': '',
            'end': '',
            'dynamic': ''
          }
        ]
      }).array
    },
    add() {
      this.$refs.table.commitProxy('add_focus')
    },
    focus() {
      this.$refs.table.focus(9)
    }
  }
}
</script>
