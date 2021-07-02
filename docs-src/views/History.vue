<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          edit
          :edit-stop="editStop"
          :max-height="400"
          fullscreen
          border
          copy
          :toolbar-config="{editHistory: true}"
          @editColumnLastToNext="editColumnLastToNext"
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
        width: 60
      },
      {
        show: true,
        prop: 'name',
        title: '名字',
        edit: {
          render: (h, { prop, row }) => {
            return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
          }
        }
      },
      {
        show: true,
        prop: 'async'
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
        edit: {
          render: (h, { prop, row }) => {
            return <el-select
              value={row[prop]}
              automaticDropdown={true}
              filterable={true}
              defaultFirstOption={true}
              on-visible-change={this.visibleChange}
              on-input={val => (row[prop] = val)}
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
  },
  mounted() {
    this.getData()
  },
  methods: {
    visibleChange(val) {
      this.editStop = val
    },
    getData() {
      this.data = mock.mock({
        'array|500': [
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
      this.data.push(mock.mock({
        'id': this.data.length,
        'name': '',
        'select': '',
        'async': '',
        'date': '',
        'switch': '',
        'end': '',
        'dynamic': ''
      }))
      this.$refs.table.focus(this.data.length - 1)
    },
    editColumnLastToNext({ placement, rowIndex }) {
      if (placement === 'right') {
        this.data[rowIndex + 1] && this.$refs.table.focus(rowIndex + 1)
      }
    },
    focus() {
      this.$refs.table.focus(9)
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
  :toolbarConfig="{editHistory: true}"
  @editColumnLastToNext="editColumnLastToNext"
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
  name: 'History',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
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
          width: 60
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
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
          edit: {
            render: (h, { prop, row }) => {
              return <el-select
                value={row[prop]}
                automaticDropdown={true}
                filterable={true}
                defaultFirstOption={true}
                on-visible-change={this.visibleChange}
                on-change={val => (row[prop] = val)}
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
      this.data = mock.mock({
        'array|500': [
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
      this.data.push(mock.mock({
        'id': this.data.length,
        'name': '',
        'select': '',
        'async': '',
        'date': '',
        'switch': '',
        'end': '',
        'dynamic': ''
      }))
      this.$refs.table.focus(this.data.length - 1)
    },
    editColumnLastToNext({ placement, rowIndex }) {
      if (placement === 'right') {
        this.data[rowIndex + 1] && this.$refs.table.focus(rowIndex + 1)
      }
    },
    focus() {
      this.$refs.table.focus(9)
    }
  }
}
</script>
