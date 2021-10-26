<template>
  <div class="page-home page">
    <h2>Table 表格</h2>
    <Document :form="documentForm" />
  </div>
</template>

<script>
import Document from '../../components/Document.vue'

export default {
  name: 'TableApi',
  components: {
    Document
  },
  data() {
    return {
      documentForm: {
        props: [
          {
            attribute: 'value / v-model',
            explain: '列配置数据',
            type: 'array',
            choosable: '',
            default: '[]',
            jsCode: `
              [
                {
                  show: true,// boolean 列是否显示

                  type: '', // string selection/radio/index

                  width: 80, // number  列宽

                  fixed: '', // string left/right 固定列

                  align: 'left', // string left/center/right  单元格对齐方式

                  // 通用配置，会根据name指定的元素对单元格做渲染模式、编辑模式、搜索模式的默认处理，原则上只需要配置config就可以了
                  config: {
                    name: 'input', // 指定ui元素
                    options: [], // select组件需要
                    format: 'yyy-MM-dd', // 日期组件需要，如果没设置，则会取props里面的format
                    defaultValue: '', // 新增行指定默认值，非必须
                  }, 

                  // table标题 (优先级 titleRender > type > title)
                  title: '', // string
                  titleRender: (h, {title, column, columnIndex}) => {
                    return // jsx
                  }

                  // table单元格 (优先级 cellRender > type > prop)
                  prop: '', // string
                  cellRender: (h, {row, rowIndex, column, columnIndex, prop}) => {
                    return // jsx
                  }

                  // 编辑
                  editable: true, // boolean 控制是否开启编辑
                  edit: { // object
                    render: (h, {row, rowIndex, column, columnIndex, prop}) => {
                      return <your-component vModel={value} on-change={this.change} />
                    },
                    disabled: false, // boolean | function({row, rowIndex}){} 为true时禁用字段
                  }

                  // 校验规则
                  rules: [
                    {
                      required: true, 
                      message: '', //可选，默认为 不能为空 
                    }, 
                    {
                      min: number, // 最小长度
                      message: '', //可选，默认为 长度不能小于 min
                    }, 
                    {
                      max: number, // 最大长度 
                      message: '', //可选，默认为 长度不能大于 max
                    }, 
                    // min,max同时存在时 message 默认为 长度必须在 min 到 max 
                    {
                      pattern: reg, // 正则
                      message: '', //可选，默认为 校验不通过
                    }, 
                    {
                      type: 'email', // 邮箱
                      message: '', //可选，默认为 请输入正确的邮箱
                    }, 
                    {
                      type: 'phone', // 手机号
                      message: '', //可选，默认为 请输入正确的手机号
                    }, 
                    {
                      validator: Function // 自定义校验，支持异步
                    }
                  ]

                  // 搜索
                  search: {
                    render: { name: 'input' }, // object/function(h, { column, columnIndex }) 搜索元素
                    rangeRender: { name: 'input' }, // object/function(h, { column, columnIndex }) 范围搜索元素
                    operator: false, // boolean 范围符号
                    operatorDefault: 'like', // string 默认类型
                    type: '' // string 扩展字段
                  }

                  drag: true,// boolean 单列拖动控制，如果设置为 false ，则该列不可做拖动操作

                  // 排序
                  sortable: false, // 对应列是否可以排序

                  selectable: false, // 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
                }
              ]
            `
          },
          {
            attribute: 'data',
            explain: 'table 数据源',
            type: 'array',
            choosable: '',
            default: '[]'
          },
          {
            attribute: 'form',
            explain: '搜索行的数据',
            type: 'object',
            choosable: '',
            default: '{}'
          },
          {
            attribute: 'rowId',
            explain: '行主键',
            type: 'string',
            choosable: '',
            default: '_rowId'
          },
          {
            attribute: 'height',
            explain: 'Table 的高度',
            type: 'number',
            choosable: '',
            default: ''
          },
          {
            attribute: 'max-height',
            explain: 'Table 最大高度',
            type: 'number',
            choosable: '',
            default: ''
          },
          {
            attribute: 'row-height',
            explain: 'Table 行高度',
            type: 'number',
            choosable: '',
            default: '36'
          },
          {
            attribute: 'border',
            explain: '是否带有纵向边框',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'show-header',
            explain: '是否显示表头',
            type: 'boolean',
            choosable: '',
            default: 'true'
          },
          {
            attribute: 'header-contextmenu',
            explain: '是否开启表头右键扩展菜单',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'empty-text',
            explain: '空数据时显示的文本内容',
            type: 'string',
            choosable: '',
            default: '暂无数据'
          },
          {
            attribute: 'highlight-current-row',
            explain: '是否要高亮当前行',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'row-class-name',
            explain: '行的 className',
            type: 'function/String',
            choosable: '',
            default: 'fn({row, rowIndex})'
          },
          {
            attribute: 'cell-class-name',
            explain: '单元格的 className',
            type: 'function/String',
            choosable: '',
            default: 'fn({row, column, rowIndex, columnIndex})'
          },
          {
            attribute: 'show-summary',
            explain: '是否在表尾显示合计行',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'sum-text',
            explain: '合计行第一列的文本',
            type: 'string',
            choosable: '',
            default: '总计'
          },
          {
            attribute: 'summary-method',
            explain: '自定义的合计计算方法',
            type: 'function',
            choosable: '',
            default: 'fn({ columns, data })'
          },
          {
            attribute: 'toolbar-config',
            explain: '工具栏配置',
            type: 'object',
            choosable: '',
            default: '{}'
          }
        ],
        slots: [
          {
            attribute: 'leftFooter',
            explain: '左侧列表底部的内容'
          },
          {
            attribute: 'rightFooter',
            explain: '右侧列表底部的内容'
          }
        ],
        events: [
          {
            attribute: 'change',
            explain: '右侧列表元素变化时触发',
            default: `{ rightKeys, dir, changeKeys }`
          },
          {
            attribute: 'left-check-change',
            explain: '左侧列表元素选中 / 取消选中时触发',
            default: `{ checkedKeys, changeKeys }`
          },
          {
            attribute: 'right-check-change',
            explain: '右侧列表元素选中 / 取消选中时触发',
            default: `{ checkedKeys, changeKeys }`
          }
        ]
      }
    }
  }
}
</script>
