<template>
  <div class="page-home page">
    <h2>Edit 编辑</h2>
    <p class="hint">
      编辑前置条件<br>
      <span class="primary">edit</span> 属性设置为
      <span class="primary"> true </span><br>
    </p>
    <p>列 <span class="primary">edit</span> 属性设置为
      <span class="primary"> true </span>，该列表头会显示可编辑列&nbsp;<i class="eff-icon-edit" title="可编辑列" />&nbsp;图标
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
    <h2>Edit 编辑</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :max-height="400"
          :data="data"
          edit
          :edit-stop="editStop"
          border
        >
          <div slot="toolbar">
            <el-button @click="add">新增</el-button>
            <el-button @click="focus">聚焦第10行</el-button>
            <el-button @click="data = []">删除所有</el-button>
            <el-button @click="getData">更新数据</el-button>
            <el-tooltip placement="top">
              <div slot="content">
                <p><el-tag>enter</el-tag> 后一个</p>
                <p><el-tag>shift</el-tag> + <el-tag>enter</el-tag> 前一个</p>
                <p><el-tag>arrowup</el-tag> 上一个</p>
                <p><el-tag>arrowdown</el-tag> 下一个</p>
              </div>
              <el-button>快捷操作</el-button>
            </el-tooltip>
          </div>
        </eff-table>
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="snippet" :code="componentSnippet" lang="html" />
          <CodeSnippet class="snippet" :code="mainSnippet" lang="js" />
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

const componentSnippet = `
<eff-table
  ref="table
  v-model="columns"
  :data="data"
  edit
  :edit-stop="editStop"
  fullscreen
  border
>
  <div slot="toolbar">
    <el-button @click="add">新增</el-button>
    <el-button @click="focus">聚焦第三行</el-button>
    <el-button @click="data = []">删除所有</el-button>
    <el-button @click="getData">更新数据</el-button>
  </div>
</eff-table>
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
      jsCode,
      componentSnippet,
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
      data: [
        { id: 1, name: '张三', sex: '男', phone: '13715201314' },
        { id: 2, name: '李四', sex: '女', phone: '13715201314' },
        { id: 3, name: '王五', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
      ],
      columns1: [
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
      ],
      data1: []
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
      this.data1 = mock.mock({
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
