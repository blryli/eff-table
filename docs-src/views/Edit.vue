<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :max-height="400"
          drag
          edit
          :edit-stop="editStop"
          fullscreen
          border
          @editColumnLastToNext="editColumnLastToNext"
        >
          <div slot="toolbar">
            <el-button @click="add">新增</el-button>
            <el-button @click="focus">聚焦第三行</el-button>
            <el-button @click="data = []">删除所有</el-button>
            <el-button @click="getData">更新数据</el-button>
          </div>
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
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
import mock from 'mockjs'
import { formatDate } from '@/utils'

const mainSnippet = `
data () {
  return {
    msg: 'vue component'
  }
}
`

const componentSnippet = `
<v-component :msg="msg" />
`
export default {
  name: 'Edit',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      value: 2,
      mainSnippet,
      componentSnippet,
      data: [],
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
          type: 'index',
          title: '序号',
          width: 60,
          fixed: 'left'
        },
        {
          show: true,
          prop: 'input',
          title: '输入框',
          width: 100,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input value={row.input} on-input={val => (row.input = val)} />
            }
          }
        },
        {
          show: true,
          prop: 'select',
          title: '选择器',
          width: 100,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-select {...{
                attrs: {
                  value: row.select,
                  automaticDropdown: true
                },
                on: {
                  'visible-change': this.visibleChange,
                  input: val => (row.select = val)
                }
              }}
              >
                {
                  this.options.map(item => {
                    return <el-option
                      key={item.value}
                      title={item.title}
                      value={item.value}>
                    </el-option>
                  })
                }
              </el-select>
            }
          }
        },
        {
          show: true,
          prop: 'date',
          title: '日期',
          width: 140,
          cellRender: (h, { row, rowIndex }) => {
            return formatDate(row.date, 'yyyy-MM-dd')
          },
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-date-picker
                value={row.date}
                on-input={val => (row.date = val)}
                on-focus={val => this.visibleChange(true)}
                on-blur={val => this.visibleChange(false)}
                type='date'
              />
            }
          }
        },
        {
          show: true,
          prop: 'skip',
          title: '跳过',
          width: 100,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input value={row.skip} on-input={val => (row.skip = val)} />
            },
            skip: true
          }
        },
        {
          show: true,
          prop: 'noEdit',
          title: '无编辑',
          width: 150
        },
        {
          show: true,
          prop: 'switch',
          title: '开关',
          width: 100,
          titleRender: (h, { column }) => {
            return [column.title, <el-tooltip class='item' effect='dark' content='控制动态禁用字段：有值打开，没值禁用' placement='top'>
              <i class='el-icon el-icon-question' />
            </el-tooltip>]
          },
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input value={row.switch} on-input={val => (row.switch = val)} />
            }
          }
        },
        {
          show: true,
          prop: 'dynamic',
          title: '动态禁用',
          width: 100,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input
                value={row.dynamic}
                disabled={!row.switch}
                on-input={val => (row.dynamic = val)}
              />
            },
            skip: ({ row, rowIndex }) => !row.switch
          }
        },
        {
          show: true,
          prop: 'end',
          title: '回车编辑下一行',
          width: 130,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input value={row.end} on-input={val => (row.end = val)} />
            }
          }
        },
        {
          show: true,
          fixed: 'right',
          width: 60,
          title: '操作',
          cellRender: (h, { row, rowIndex }) => {
            return <el-button size='mini' type='text' title='删除' icon='el-icon-delete' on-click={() => this.deleted(rowIndex)}/>
          }
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.getData()
    }, 500)
  },
  methods: {
    visibleChange(val) {
      this.editStop = val
    },
    getData() {
      this.data = mock.mock({
        'array|500': [
          {
            'input': '@name',
            'noEdit': '@name',
            'select': '',
            'date': '',
            'skip': '',
            'switch': '',
            'end': '',
            'dynamic': ''
          }
        ]
      }).array
    },
    add() {
      this.data.push(mock.mock({
        'input': '',
        'select': '',
        'date': '',
        'skip': '',
        'switch': '',
        'end': '',
        'dynamic': ''
      }))
      this.$refs.table.focus(this.data.length - 1)
    },
    editColumnLastToNext({ placement, rowIndex, columnIndex }) {
      if (placement === 'right') {
        this.$refs.table.focus(rowIndex + 1)
      }
    },
    deleted(rowIndex) {
      this.data.splice(rowIndex, 1)
    },
    focus() {
      this.$refs.table.focus(12)
    }
  }
}
</script>
