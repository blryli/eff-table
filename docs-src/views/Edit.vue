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
          v-bind="tableOptions"
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
          v-bind="tableOptions1"
        />
      </div>
    </section>
    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode" />
          <CodeSnippet class="javascript" :code="jsCode1" />
        </div>
      </Collapse>
    </section>
    <p>组件默认UI元素用的是element-ui，但不依赖element-ui，可以通过renderMap自行配置UI元素</p>
    <CodeSnippet class="javascript" :code="mapCode" />
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table
    ref="table"
    v-bind="tableOptions"
  />
  `

const objCode = `
  // column对象
  
  {
    config: { // 通用配置
      name: 'input', // 指定ui元素
      options: [], // select、级联选择器等组件需要
      defaultValue: '', // 新增行指定默认值，非必须
    }, 

    cellRender: {}, // 单元格配置，会与config的配置进行合并

    edit: { // 编辑框配置，会与config的配置进行合并
      render: {} // 支持对象及函数模式
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
        tableOptions: {
          edit: true,
          border: true,
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
  }
  `
const jsCode1 = `
  export default {
    data() {
      return {
        tableOptions1: {
          maxHeight: 400,
          edit: true,
          border: true,
          toolbarConfig: {
            buttons: [{ name: 'button', code: 'add', children: '新增' }]
          },
          data: [
            { id: 1, name: '张三', want: '1', sex: '1', date: '2021-04-12', address: [], address1: [], address2: '' },
            { id: 2, name: '李四', want: '2', sex: '2', date: null, address: [], address1: [], address2: '' },
            { id: 3, name: '王五', want: '3', sex: '1', date: '2021-04-12', address: [], address1: [], address2: '' },
            { id: 4, name: '赵六', want: '3', sex: '1', date: null, address: [], address1: [], address2: '' }
          ],
          columns: [
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
              prop: 'want',
              title: '我想要',
              config: { name: 'select', options: [{ label: '级联选择器', value: '1' }, { label: '选择器', value: '2' }, { label: '输入框', value: '3' }] },
              edit: true
            },
            {
              show: true,
              prop: 'address',
              title: '动态编辑器',
              titleSuffix: { icon: 'info', message: '根据我想要动态变化成地址级联选择器/选择器/输入框' },
              edit: {
                render: (h, { row }) => {
                  const cases = {
                    '1': {
                      prop: 'address',
                      name: 'cascader',
                      props: {
                        props: {
                          label: 'label1',
                          value: 'value1',
                          children: 'children1'
                        }
                      },
                      options: () => [{
                        value1: 'zhinan',
                        label1: '指南',
                        children1: [{
                          value1: 'shejiyuanze',
                          label1: '设计原则',
                          children1: [{
                            value1: 'yizhi',
                            label1: '一致'
                          }, {
                            value1: 'fankui',
                            label1: '反馈'
                          }, {
                            value1: 'xiaolv',
                            label1: '效率'
                          }, {
                            value1: 'kekong',
                            label1: '可控'
                          }]
                        }]
                      }]
                    },
                    '2': {
                      prop: 'address1',
                      name: 'select',
                      props: {
                        label: 'label',
                        value: 'value'
                      },
                      options: () => [
                        { value: 'address1-1', label: '广东省深圳市' },
                        { value: 'address1-2', label: '广东省东莞市' }
                      ]
                    },
                    '3': { name: 'input', prop: 'address2' }
                  }
                  return cases[row.want]
                }
              }
            },
            {
              show: true,
              prop: 'date',
              title: '疫苗预约日期',
              config: {
                name: 'date-picker'
              },
              edit: true
            }
          ]
        }
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
      jsCode,
      jsCode1,
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
      tableOptions: {
        edit: true,
        border: true,
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
      },
      tableOptions1: {
        maxHeight: 400,
        edit: true,
        copy: true,
        border: true,
        toolbarConfig: {
          buttons: [{ name: 'button', code: 'add', children: '新增' }]
        },
        data: [
          { id: 1, name: '张三', want: '1', sex: '1', date: '2021-04-12', address: [], address1: [], address2: '' },
          { id: 2, name: '李四', want: '2', sex: '2', date: null, address: [], address1: [], address2: '' },
          { id: 3, name: '王五', want: '3', sex: '1', date: '2021-04-12', address: [], address1: [], address2: '' },
          { id: 4, name: '赵六', want: '3', sex: '1', date: null, address: [], address1: [], address2: '' }
        ],
        columns: [
          {
            show: true,
            prop: 'name',
            title: '名字',
            cellRender: (h) => h('el-button', { on: { click: this.click }}, 'click'),
            config: { name: 'input' }
            // edit: true
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
            prop: 'want',
            title: '我想要',
            config: { name: 'select', options: [{ label: '级联选择器', value: '1' }, { label: '选择器', value: '2' }, { label: '输入框', value: '3' }] },
            edit: true
          },
          {
            show: true,
            prop: 'address',
            title: '动态编辑器',
            titleSuffix: { icon: 'info', message: '根据我想要动态变化成地址级联选择器/选择器/输入框' },
            edit: {
              render: (h, { row }) => {
                const cases = {
                  '1': {
                    prop: 'address',
                    name: 'cascader',
                    props: {
                      'show-all-levels': false,
                      props: {
                        label: 'label1',
                        value: 'value1',
                        children: 'children1'
                      }
                    },
                    options: () => [{
                      value1: 'zhinan',
                      label1: '指南',
                      children1: [{
                        value1: 'shejiyuanze',
                        label1: '设计原则',
                        children1: [{
                          value1: 'yizhi',
                          label1: '一致/222 '
                        }, {
                          value1: 'fankui',
                          label1: '反馈'
                        }, {
                          value1: 'xiaolv',
                          label1: '效率'
                        }, {
                          value1: 'kekong',
                          label1: '可控'
                        }]
                      }]
                    }]
                  },
                  '2': {
                    prop: 'address1',
                    name: 'select',
                    props: {
                      label: 'label',
                      value: 'value'
                    },
                    options: () => [
                      { value: 'address1-1', label: '广东省深圳市' },
                      { value: 'address1-2', label: '广东省东莞市' }
                    ]
                  },
                  '3': { name: 'input', prop: 'address2' }
                }
                return cases[row.want]
              }
            }
          },
          {
            show: true,
            prop: 'date',
            title: '疫苗预约日期',
            config: {
              name: 'date-picker'
            },
            edit: true
          }
        ]
      }
    }
  },
  methods: {
    click() {
      console.log('click---')
    }
  }
}
</script>
