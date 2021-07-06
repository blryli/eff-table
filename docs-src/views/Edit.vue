<template>
  <div class="page-home page">
    <h2>Edit 编辑</h2>
    <p class="hint">
      表格 <span class="primary">edit</span> 属性需要设置为
      <span class="primary"> true </span><br>
      快捷编辑，旨在尽量让用户脱离鼠标进行编辑，快捷键
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
    <p>列 <span class="primary">edit</span> 属性设置为<span class="primary"> true </span>，
      打开编辑功能，列头会显示可编辑&nbsp;<i class="eff-icon-edit" title="可编辑列" />&nbsp;图标，默认渲染成 <span class="primary"> input </span> 编辑框（<span class="primary">editable</span> 属性设置为<span class="primary"> false </span> 时取消列编辑）
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
    <CodeSnippet class="javascript" :code="objCode" />
    <p>通常配置 <span class="primary">config</span> 就可以了，特殊情况下需要单独配置 <span class="primary">cellRender</span> 及 <span class="primary">edit 的 render</span> 属性</p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-bind="tableOptions"
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
    <p>列 <span class="primary">edit</span> 的 render 属性为函数时，需要自己做双向绑定。带下拉框的元素及其他特定元素，需要动态设置 table 的 edit-stop 属性， 如当下拉框打开时</p>
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
    edit
    border
  />
  `
const htmlCode1 = `
  <eff-table
    v-model="columns"
    :data="data"
    :max-height="400"
    edit
    border
  />
  `
const htmlCode2 = `
  <eff-table
    v-model="columns"
    :data="data"
    :max-height="400"
    edit
    :edit-stop="editStop"
    border
  />
  `
const objCode = `
  // column对象
  
  {
    config: { // 通用配置
      name: 'input', // 指定ui元素
      options: [], // select组件需要
      format: 'yyy-MM-dd', // 日期组件需要，如果没设置，则会取props里面的format
      defaultValue: '', // 新增行指定默认值，非必须
    }, 

    cellRender: {}, // 单元格配置，会与config的配置进行合并

    edit: { // 编辑框配置，会与config的配置进行合并
      render: {}
    }
  }
  `
const mapCode = `
  Vue.use(EffTable, {renderMap: {'input': 'i-input'}})
  `
const funcCode = `
  // column对象
  
  {
    cellRender: (h, {row, rowIndex, column, columnIndex, prop}) => {
      return // 返回字符串或render
    },

    edit: {
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
            editable: false,
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
        tableOptions: {
          maxHeight: 400,
          edit: true,
          border: true,
          data: [
            { id: 1, name: '张三', sex: '1', phone: '13715201314', date: '2021-04-12', vaccination: '1' },
            { id: 2, name: '李四', sex: '2', phone: '13715201314', date: null, vaccination: '2' },
            { id: 3, name: '王五', sex: '1', phone: '13715201314', date: '2021-04-12', vaccination: '' },
            { id: 4, name: '赵六', sex: '1', phone: '13715201314', date: null, vaccination: '3' }
          ],
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
          ]
        },
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
  name: 'Edit',
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
      tableOptions: {
        maxHeight: 400,
        edit: true,
        border: true,
        toolbarConfig: {
          buttons: [{ name: 'button', code: 'add', children: '新增' }]
        },
        data: [
          { id: 1, name: '张三', sex: '1', phone: '13715201314', date: '2021-04-12', vaccination: '1' },
          { id: 2, name: '李四', sex: '2', phone: '13715201314', date: null, vaccination: '2' },
          { id: 3, name: '王五', sex: '1', phone: '13715201314', date: '2021-04-12', vaccination: '' },
          { id: 4, name: '赵六', sex: '1', phone: '13715201314', date: null, vaccination: '3' }
        ],
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
        ]
      },
      editStop: false,
      sexOptions: [{ label: '男', value: '1' }, { label: '女', value: '2' }],
      vaccinationOptions: [{ value: '1', label: '还没有打' }, { value: '2', label: '打了一针' }, { value: '3', label: '打完了' }],
      data1: [
        { id: 1, name: '张三', sex: '1', phone: '13715201314', date: '2021-04-12', vaccination: '1' },
        { id: 2, name: '李四', sex: '2', phone: '13715201314', date: null, vaccination: '2' },
        { id: 3, name: '王五', sex: '1', phone: '13715201314', date: '2021-04-12', vaccination: '' },
        { id: 4, name: '赵六', sex: '1', phone: '13715201314', date: null, vaccination: '3' }
      ],
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
      ]
    }
  },
  methods: {
    visibleChange(val) {
      this.editStop = val
    }
  }
}
</script>
