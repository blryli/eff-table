<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="list"
          :form.sync="form"
          :max-height="400"
          drag
          column-control
          edit
          :edit-stop="editStop"
          search
          show-summary
          border
          select-range
          copy
          :sort-config="{multiple: true}"
          :toolbar-config="{
            refresh: true,
            showReplace: true,
            fullscreen: true,
            columnBatchControl: true,
            editHistory: true,
            seniorQuery: seniorQuery
          }"
          :footer-action-config="{showPager: true, showBorder: true}"
          @selection-change="selectionChange"
          @search-change="searchChange"
        >
          <div slot="toolbar">
            <el-button @click="add">新增</el-button>
            <el-button @click="deleted">删除</el-button>
            <el-button @click="getData">更新数据</el-button>
            <el-tooltip placement="top">
              <div slot="content">
                <p><el-tag>enter</el-tag> 后一个</p>
                <p><el-tag>shift</el-tag> + <el-tag>enter</el-tag> 前一个</p>
                <p><el-tag>arrowup</el-tag> 上一个</p>
                <p><el-tag>arrowdown</el-tag> 下一个</p>
                <p><el-tag>ctrl</el-tag> + <el-tag>b</el-tag> 显示/隐藏搜索列</p>
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

const mainSnippet = `
data() {
  return {
    searchData: [],
    form: {},
    editStop: false,
    options: [{
      value: '男',
      label: '男'
    }, {
      value: '女',
      label: '女'
    }],
    hobbys: [{
      value: 'K歌',
      label: 'K歌'
    }, {
      value: '游泳',
      label: '游泳'
    }, {
      value: '篮球',
      label: '篮球'
    }],
    data: [],
    list: [],
    selectionIndexs: [],
    columns: [
      {
        show: true,
        type: 'selection',
        width: 40,
        fixed: 'left'
      },
      {
        show: true,
        prop: 'cname',
        title: '名字',
        search: true,
        width: 120,
        edit: {
          render: (h, { prop, row }) => {
            return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
          }
        }
      },
      {
        show: true,
        prop: 'sex',
        title: '性别',
        width: 100,
        search: {
          render: (h, { prop, row }) => {
            return <el-select
              value={this.form[prop]}
              clearable={true}
              on-change={val => this.updateForm(prop, val)}
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
        },
        edit: {
          render: (h, { prop, row }) => {
            return <el-select
              value={row[prop]}
              automaticDropdown={true}
              filterable={true}
              defaultFirstOption={true}
              on-change={val => (row[prop] = val)}
              on-visible-change={this.visibleChange}
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
        prop: 'age',
        title: '年龄',
        width: 100,
        sortable: true,
        search: {
          operator: true
        },
        edit: {
          render: (h, { prop, row }) => {
            return <el-input value={row[prop]} type='number' on-input={val => (row[prop] = val)} />
          }
        }
      },
      {
        show: true,
        prop: 'hobby',
        title: '爱好',
        search: {
          render: (h, { prop, row, rowIndex }) => {
            return <el-select
              value={this.form[prop]}
              clearable={true}
              multiple={true}
              collapseTags={true}
              on-change={val => this.updateForm(prop, val)}
            >
              {
                this.hobbys.map(item => {
                  return <el-option
                    key={item.value}
                    title={item.title}
                    value={item.value}>
                  </el-option>
                })
              }
            </el-select>
          }
        },
        edit: {
          render: (h, { prop, row }) => {
            return <el-select
              value={row[prop]}
              automaticDropdown={true}
              filterable={true}
              defaultFirstOption={true}
              on-change={val => (row[prop] = val)}
              on-visible-change={this.visibleChange}
              style='width: 100%'
            >
              {
                this.hobbys.map(item => {
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
        title: '时间',
        search: {
          render: (h, { prop }) => {
            return <el-date-picker
              value={this.form[prop]}
              type='date'
              on-input={val => this.updateForm(prop, val)}
            />
          },
          rangeRender: (h, { prop }) => {
            return <el-date-picker
              value={this.form[prop]}
              type='daterange'
              on-input={val => this.updateForm(prop, val)}
            />
          },
          operator: true,
          operatorDefault: 'equals',
          type: 'dates'
        },
        edit: {
          render: (h, { prop, row }) => {
            return <el-date-picker
              value={row[prop]}
              value-format='yyyy-MM-dd'
              on-input={val => (row[prop] = val)}
              on-focus={val => this.visibleChange(true)}
              on-blur={val => this.visibleChange(false)}
              type='date'
            />
          }
        }
      }
    ]
  }
},
mounted() {
  setTimeout(() => {
    this.getData()
  }, 50)
},
methods: {
  add() {
    this.data.push(this.columns.reduce((acc, cur) => {
      acc.cur = ''
      return acc
    }, {}))
    this.list = [...this.data]
    this.$refs.table.focus(this.data.length - 1)
  },
  deleted() {
    const { selectionIndexs } = this
    console.log('selectionIndexs', selectionIndexs)
    this.data = this.data.filter((d, i) => selectionIndexs.indexOf(i) < 0)
    this.list = [...this.data]
  },
  selectionChange(selection, selectionIndexs) {
    this.selectionIndexs = selectionIndexs
  },
  getData() {
    this.data = mock.mock({
      'array|100': [
        {
          'id|+1': 1,
          'age': /\d{2}/,
          'cname': '@cname',
          'sex': function name() {
            return this.index % 2 === 0 ? '男' : '女'
          },
          'hobby': function name() {
            return this.index % 2 === 0 ? '游泳' : this.index % 5 === 0 ? '篮球' : 'K歌'
          },
          'date': '@date',
          'index|+1': 1
        }
      ]
    }).array
    this.list = [...this.data]
  },
  visibleChange(val) {
    this.editStop = val
  },
  updateForm(prop, val) {
    this.$set(this.form, prop, val)
  },
  searchChange(val) {
    console.log(JSON.stringify(val, null, 2))
    this.searchData = val
    let list = [...this.data]
    if (val.length) {
      val.forEach(d => {
        const { field, operator, content } = d
        list = list.filter(da => {
          if (Array.isArray(content)) {
            if (operator === 'like') {
              return content.includes(da[field])
            } else {
              const [start, end] = content
              return +da[field] > +start && +da[field] < +end
            }
          } else {
            const daValue = da[field]
            switch (operator) {
              case 'equals':
                return daValue === content

              case 'unequals':
                return daValue.indexOf(content) === -1

              case 'less':
                return +daValue < +content

              case 'greater':
                return +daValue > +content

              case 'lessthan':
                return +daValue <= +content

              case 'greaterthan':
                return +daValue >= +content

              default:
                return daValue.indexOf(content) > -1
            }
          }
        })
      })
    }
    this.list = list
  }
}
`

const componentSnippet = `
<eff-table
  ref="table"
  v-model="columns"
  :data="list"
  :form.sync="form"
  drag
  column-control
  edit
  :edit-stop="editStop"
  search
  fullscreen
  show-summary
  border
  select-range
  copy
  show-replace
  @selection-change="selectionChange"
  @search-change="searchChange"
/>
`
export default {
  name: 'Full',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      mainSnippet,
      componentSnippet,
      searchData: [],
      form: {},
      editStop: false,
      options: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      hobbys: [{
        value: 'K歌',
        label: 'K歌'
      }, {
        value: '游泳',
        label: '游泳'
      }, {
        value: '篮球',
        label: '篮球'
      }],
      data: [],
      list: [],
      seniorQuery: {
        fields: ['field1', 'field2', 'field3'],
        op: [{ label: '大于', value: '>' }, { label: '等于', value: '=' }, { label: '大于等于', value: '>=' }]
      },
      selectionIndexs: [],
      columns: [
        {
          show: true,
          type: 'selection',
          width: 40,
          fixed: 'left'
        },
        {
          show: true,
          prop: 'cname',
          title: '名字',
          search: true,
          width: 120,
          config: { name: 'input' },
          edit: true
        },
        {
          show: true,
          prop: 'sex',
          title: '性别',
          search: true,
          width: 120,
          config: { name: 'select', options: [{ label: '男', value: '1' }, { label: '女', value: '2' }] },
          edit: true
        },
        {
          show: true,
          prop: 'age',
          title: '年龄',
          width: 100,
          sortable: true,
          rules: [{
            required: true
          }],
          search: {
            operator: true
          },
          config: { name: 'input' },
          edit: true
        },
        {
          show: true,
          prop: 'hobby',
          title: '爱好',
          config: { name: 'select', options: () => this.hobbys },
          search: true,
          edit: true
        },
        {
          show: true,
          prop: 'date',
          title: '时间',
          config: { name: 'date-picker' },
          search: true,
          edit: true
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.getData()
      this.$refs.table.$set(this.$refs.table, 'pager', {
        pageNum: 1,
        pageSize: 10,
        total: 1000
      })
    }, 50)
  },
  methods: {
    add() {
      this.data.push(this.columns.reduce((acc, cur) => {
        acc.cur = ''
        return acc
      }, {}))
      this.list = [...this.data]
      this.$refs.table.focus(this.data.length - 1)
    },
    deleted() {
      const { selectionIndexs } = this
      this.data = this.data.filter((d, i) => selectionIndexs.indexOf(i) < 0)
      this.list = [...this.data]
    },
    selectionChange(selection, selectionIndexs) {
      this.selectionIndexs = selectionIndexs
    },
    getData() {
      this.data = mock.mock({
        'array|1000': [
          {
            'id|+1': 1,
            'age': /\d{2}/,
            'cname': '@cname',
            'sex': function name() {
              return this.index % 2 === 0 ? '男' : '女'
            },
            'hobby': function name() {
              return this.index % 2 === 0 ? '游泳' : this.index % 5 === 0 ? '篮球' : 'K歌'
            },
            'date': '@date',
            'index|+1': 1
          }
        ]
      }).array

      this.list = [...this.data]
    },
    visibleChange(val) {
      this.editStop = val
    },
    updateForm(prop, val) {
      this.$set(this.form, prop, val)
    },
    searchChange(val) {
      // console.log(JSON.stringify(val, null, 2))
      this.searchData = val
      let list = [...this.data]
      if (val.length) {
        val.forEach(d => {
          const { field, operator, content } = d
          list = list.filter(da => {
            if (Array.isArray(content)) {
              if (operator === 'like') {
                return content.includes(da[field])
              } else {
                const [start, end] = content
                return +da[field] > +start && +da[field] < +end
              }
            } else {
              const daValue = da[field]
              switch (operator) {
                case 'equals':
                  return daValue === content

                case 'unequals':
                  return daValue.indexOf(content) === -1

                case 'less':
                  return +daValue < +content

                case 'greater':
                  return +daValue > +content

                case 'lessthan':
                  return +daValue <= +content

                case 'greaterthan':
                  return +daValue >= +content

                default:
                  return daValue.indexOf(content) > -1
              }
            }
          })
        })
      }
      this.list = list
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
