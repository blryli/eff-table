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
          edit
          :edit-stop="editStop"
          fullscreen
          border
        />
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
              return <el-input disabled={true} value={row.skip} on-input={val => (row.skip = val)} />
            }
          }
        },
        {
          show: true,
          prop: 'switch',
          title: '开关',
          width: 100,
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
          width: 100,
          edit: {
            render: (h, { row, rowIndex }) => {
              return <el-input value={row.end} on-input={val => (row.end = val)} />
            }
          }
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|5': [
          {
            'input': '',
            'select': '',
            'date': '',
            'skip': '',
            'switch': '',
            'end': '',
            'dynamic': ''
          }
        ]
      }).array
      console.log(this.data)
    }, 500)
  },
  methods: {
    visibleChange(val) {
      console.log('visibleChange', val)
      this.editStop = val
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
    deleted() {
      this.data = []
    },
    focus() {
      this.$refs.table.focus(this.value)
    }
  }
}
</script>
