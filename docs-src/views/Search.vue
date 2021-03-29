<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        {{ form }}
        <eff-table
          v-model="columns"
          v-model:form="form"
          :data="list"
          search
          fullscreen
          border
          @search-change="searchChange"
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

const mainSnippet = `
data () {
  return {
    searchData: [],
    form: {},
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
    columns: [
      {
        show: true,
        prop: 'index',
        title: '序号',
        fixed: 'left',
        width: 80
      },
      {
        show: true,
        prop: 'cname',
        title: '名字',
        search: true,
        width: 120
      },
      {
        show: true,
        prop: 'sex',
        title: '性别',
        width: 100,
        search: {
          render: (h, { prop, row, rowIndex }) => {
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
        }
      },
      {
        show: true,
        prop: 'age',
        title: '年龄',
        search: {
          operator: true
        },
        width: 100
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
        }
      },
      {
        show: true,
        prop: 'datetime',
        title: '时间',
        search: {
          render: (h, { prop }) => {
            return <el-date-picker
              value={this.form[prop]}
              type='date'
              on-input={val => this.updateForm(prop, val)}
            ></el-date-picker>
          },
          rangeRender: (h, { prop }) => {
            return <el-date-picker
              value={this.form[prop]}
              type='daterange'
              on-input={val => this.updateForm(prop, val)}
            ></el-date-picker>
          },
          operator: true,
          operatorDefault: 'equals',
          type: 'dates'
        }
      }
    ]
  },
  updateForm(prop, val) {
    this.$set(this.form, prop, val)
  },
  searchChange(val) {
    this.searchData = val
    let list = [...this.data]
    if (val.length) {
      val.forEach(d => {
        list = list.filter(da => Array.isArray(d.content) ? d.content.includes(da[d.field]) : da[d.field].indexOf(d.content) > -1)
      })
    }
    this.list = list
  }
}
`

const componentSnippet = `
<eff-table
  v-model="columns"
  :data="list"
  :form.sync="form"
  search
  fullscreen
  border
  @search-change="searchChange"
/>
`
export default {
  name: 'Search',
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
      columns: [
        {
          show: true,
          prop: 'index',
          title: '序号',
          fixed: 'left',
          width: 80
        },
        {
          show: true,
          prop: 'cname',
          title: '名字',
          search: true,
          width: 120
        },
        {
          show: true,
          prop: 'sex',
          title: '性别',
          width: 100,
          search: {
            render: (h, { prop, row, rowIndex }) => {
              return <el-select
                vModel={this.form[prop]}
                clearable={true}
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
          search: {
            operator: true
          },
          width: 100
        },
        {
          show: true,
          prop: 'hobby',
          title: '爱好',
          search: {
            render: (h, { prop, row, rowIndex }) => {
              return <el-select
                vModel={this.form[prop]}
                clearable={true}
                multiple={true}
                collapseTags={true}
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
          prop: 'datetime',
          title: '时间',
          search: {
            render: (h, { prop }) => {
              return <el-date-picker
                vModel={this.form[prop]}
                type='date'
              />
            },
            rangeRender: (h, { prop }) => {
              return <el-date-picker
                vModel={this.form[prop]}
                type='daterange'
              />
            },
            operator: true,
            operatorDefault: 'equals',
            type: 'dates'
          }
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|100': [
          {
            'age': /\d{2}/,
            'cname': '@cname',
            'sex': function name() {
              return this.index % 2 === 0 ? '男' : '女'
            },
            'hobby': function name() {
              return this.index % 2 === 0 ? '游泳' : this.index % 5 === 0 ? '篮球' : 'K歌'
            },
            'datetime': '@datetime',
            'index|+1': 1
          }
        ]
      }).array
      this.list = [...this.data]
    }, 50)
  },
  methods: {
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
