<template>
  <div class="page-home page">
    <h2>Search 搜索</h2>
    <p class="hint">
      表格 <span class="primary">search</span> 属性设置为
      <span class="primary"> true </span>，会展示搜索行<br>
    </p>
    <p>列 <span class="primary">search</span> 属性设置为
      <span class="primary"> true </span>，打开搜索功能&nbsp;，搜索框默认渲染成 <span class="primary"> input </span>
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          search
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
    <CodeSnippet class="javascript" :code="objCode" />
    <p>通常配置 <span class="primary">config</span> 就可以了，特殊情况下需要单独配置 <span class="primary">cellRender</span> 及 <span class="primary">edit > render</span> 属性</p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns1"
          :data="data1"
          :max-height="400"
          search
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
    <p>组件默认UI元素用的是element-ui，但不依赖element-ui，可以通过renderMap自行配置UI元素</p>
    <CodeSnippet class="javascript" :code="mapCode" />

    <h3>render函数模式</h3>
    <CodeSnippet class="javascript" :code="funcCode" />
    <p>列 <span class="primary">edit</span> 为render函数时，需要自己做双向绑定。带下拉框的元素及其他特定元素，需要动态设置 table 的 edit-stop 属性， 如当下拉框打开时</p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns2"
          :data="data1"
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
          <CodeSnippet class="html" :code="htmlCode2" />
          <CodeSnippet class="javascript" :code="jsCode2" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
import { formatDate } from '@/utils'

const htmlCode = `
  <eff-table
    v-model="columns"
    :data="data"
    search
    border
  />
  `
const htmlCode1 = `
  <eff-table
    v-model="columns"
    :data="data"
    :max-height="400"
    search
    border
  />
  `
const htmlCode2 = `
  <eff-table
    v-model="columns"
    :data="data"
    :max-height="400"
    search
    border
  />
  `
const objCode = `
  // column对象
  
  {
    config: { name: 'input' }, // 通用配置，对name指定的元素有内置的处理


    search: { // 搜索框配置，会与config的配置进行合并
      render: {}
    }
  }
  `
const mapCode = `
  Vue.use(EffTable, {renderMap: {'input': 'i-input'}})
  `
const funcCode = `
  // column对象
  
    search: {
      render: (h, {row, rowIndex, column, columnIndex, prop}) => {
        return <your-component vModel={value} on-change={this.change} />
      }
    }
  }
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
            search: true
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            search: true
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            search: true
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
            edit: true
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
            config: { name: 'input' },
            edit: true
          },
          {
            show: true,
            prop: 'date',
            title: '疫苗预约日期',
            config: { name: 'date-picker', format: 'yyyy-MM-dd' },
            edit: true
          },
          {
            show: true,
            prop: 'vaccination',
            title: '疫苗注射情况',
            cellRender: { name: 'tag' },
            config: { options: [{ value: '1', label: '还没有打' }, { value: '2', label: '打了一针' }, { value: '3', label: '打完了' }] },
            edit: {
              render: { name: 'select' }
            }
          }
        ],
        data1: [
          { id: 1, name: '张三', sex: '1', phone: '13715201314', date: 1622476800000, vaccination: '1' },
          { id: 2, name: '李四', sex: '2', phone: '13715201314', date: null, vaccination: '2' },
          { id: 3, name: '王五', sex: '1', phone: '13715201314', date: 1624982400000, vaccination: '' },
          { id: 4, name: '赵六', sex: '1', phone: '13715201314', date: null, vaccination: '3' }
        ],
      }
    }
  }
  `
const jsCode2 = `
  import { formatDate } from '@/utils'
  export default {
    data() {
      return {
        editStop: false,
        sexOptions: [{ label: '男', value: '1' }, { label: '女', value: '2' }],
        vaccinationOptions: [{ value: '1', label: '还没有打' }, { value: '2', label: '打了一针' }, { value: '3', label: '打完了' }],
        columns2: [
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
            cellRender: (h, { row, prop }) => {
              return row[prop] ? this.sexOptions.find(d => d.value === row[prop]).label : ''
            },
            edit: {
              render: (h, { row, prop }) => {
                return (
                  <el-select
                    value={row[prop]}
                    automaticDropdown={true}
                    defaultFirstOption={true}
                    on-change={val => (row[prop] = val)}
                    on-visible-change={this.visibleChange}
                  >
                    {
                      this.sexOptions.map(option => <el-option label={option.label} value={option.label} />)
                    }
                  </el-select>
                )
              }
            }
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            edit: {
              render: (h, { prop, row }) => {
                return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
              }
            }
          },
          {
            show: true,
            prop: 'date',
            title: '疫苗预约日期',
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
            prop: 'vaccination',
            title: '疫苗注射情况',
            cellRender: (h, { row, prop }) => {
              return row[prop] ? <el-tag>{this.vaccinationOptions.find(d => d.value === row[prop]).label}</el-tag> : ''
            },
            edit: {
              render: (h, { row, prop }) => {
                return (
                  <el-select
                    value={row[prop]}
                    automaticDropdown={true}
                    defaultFirstOption={true}
                    on-change={val => (row[prop] = val)}
                    on-visible-change={this.visibleChange}
                  >
                    {
                      this.vaccinationOptions.map(option => <el-option label={option.label} value={option.label} />)
                    }
                  </el-select>
                )
              }
            }
          }
        ]
      }
    },
    methods: {
      visibleChange(val) {
        this.editStop = val
      }
    }
  }
  `

export default {
  name: 'Search',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      htmlCode1,
      htmlCode2,
      jsCode,
      jsCode1,
      jsCode2,
      objCode,
      funcCode,
      mapCode,
      options: [{
        value: '选项1',
        label: '1'
      }, {
        value: '选项2',
        label: '2'
      }],
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
          search: true
        },
        {
          show: true,
          prop: 'sex',
          title: '性别',
          config: { name: 'select', options: [{ label: '男', value: '1' }, { label: '女', value: '2' }] },
          search: true
        },
        {
          show: true,
          prop: 'age',
          title: '年龄',
          search: {
            operator: true
          }
        },
        {
          show: true,
          prop: 'phone',
          title: '手机',
          search: true
        }
      ],
      data: [
        { id: 1, name: '张三', sex: '男', age: '20', phone: '13715201314' },
        { id: 2, name: '李四', sex: '女', age: '25', phone: '13715201314' },
        { id: 3, name: '王五', sex: '男', age: '32', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', age: '18', phone: '13715201314' }
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
          config: { name: 'input' },
          edit: true
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
          config: { name: 'input' },
          edit: true
        },
        {
          show: true,
          prop: 'date',
          title: '疫苗预约日期',
          config: {
            name: 'date-picker', format: 'yyyy-MM-dd'
          },
          edit: true
        },
        {
          show: true,
          prop: 'vaccination',
          title: '疫苗注射情况',
          config: { options: [{ value: '1', label: '还没有打' }, { value: '2', label: '打了一针' }, { value: '3', label: '打完了' }] },
          cellRender: { name: 'tag' },
          edit: {
            render: { name: 'select' }
          }
        }
      ],
      editStop: false,
      sexOptions: [{ label: '男', value: '1' }, { label: '女', value: '2' }],
      vaccinationOptions: [{ value: '1', label: '还没有打' }, { value: '2', label: '打了一针' }, { value: '3', label: '打完了' }],
      columns2: [
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
          cellRender: (h, { row, prop }) => {
            const option = this.sexOptions.find(d => d.value === row[prop])
            return option ? option.label : ''
          },
          edit: {
            render: (h, { row, prop }) => {
              return (
                <el-select
                  value={row[prop]}
                  on-change={val => (row[prop] = val)}
                  automaticDropdown={true}
                  defaultFirstOption={true}
                  on-visible-change={this.visibleChange}
                >
                  {
                    this.sexOptions.map(option => <el-option label={option.label} value={option.value} />)
                  }
                </el-select>
              )
            }
          }
        },
        {
          show: true,
          prop: 'phone',
          title: '手机',
          edit: {
            render: (h, { row, prop }) => {
              return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
            }
          }
        },
        {
          show: true,
          prop: 'date',
          title: '疫苗预约日期',
          cellRender: (h, { row, prop }) => {
            return formatDate(row[prop], 'yyyy-MM-dd')
          },
          edit: {
            render: (h, { row, prop }) => {
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
          prop: 'vaccination',
          title: '疫苗注射情况',
          cellRender: (h, { row, prop }) => {
            const option = this.vaccinationOptions.find(d => d.value === row[prop])
            return option ? <el-tag>{option.label}</el-tag> : ''
          },
          edit: {
            render: (h, { row, prop }) => {
              return (
                <el-select
                  value={row[prop]}
                  automaticDropdown={true}
                  defaultFirstOption={true}
                  on-change={val => (row[prop] = val)}
                  on-visible-change={this.visibleChange}
                >
                  {
                    this.vaccinationOptions.map(option => <el-option label={option.label} value={option.value} />)
                  }
                </el-select>
              )
            }
          }
        }
      ],
      data1: [
        { id: 1, name: '张三', sex: '1', phone: '13715201314', date: 1622476800000, vaccination: '1' },
        { id: 2, name: '李四', sex: '2', phone: '13715201314', date: null, vaccination: '2' },
        { id: 3, name: '王五', sex: '1', phone: '13715201314', date: 1624982400000, vaccination: '' },
        { id: 4, name: '赵六', sex: '1', phone: '13715201314', date: null, vaccination: '3' }
      ]
    }
  },
  methods: {
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
}
</script>

