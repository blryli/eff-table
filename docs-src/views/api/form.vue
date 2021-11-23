<template>
  <div class="page-home page">
    <Document title="form" :form="documentForm">
      <h2>From 表单 <router-link class="page-router" to="/FormBase">查看示例</router-link></h2>
    </Document>
  </div>
</template>

<script>
import Document from '../../components/Document.vue'

export default {
  name: 'FormApi',
  components: {
    Document
  },

  data() {
    return {
      documentForm: {
        props: [
          {
            attribute: 'data',
            explain: '表单的数据源',
            type: 'object',
            choosable: '',
            default: '{}'
          },
          {
            attribute: 'columns',
            explain: '使用配置模式时的字段集合',
            type: 'array',
            choosable: '',
            default: '[]',
            code:
`
  [
    {
      title: 'title', // string 标签文本

      titleWidth: '80px', // string 标签的宽度，会覆盖 form 上的定义的titleWidth

      span: 24, // number item所占的栅格比例

      prop: '', // string 字段路径，支持嵌套对象，如 person.name、persons.0.name

      itemRender: { // object/function
        name: 'input', // 指定ui元素
        options: [], // select组件需要
        format: ({row, column, columnIndex, prop}) => {}, // 格式化单元格内容
      }

      rules: [ // 校验规则
        {
          required: true, 
          message: '', //可选，默认为 不能为空 
          trigger: '' // 可选，默认为 blur，对于select组件必须声明为 change
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
    }
  ]

`
          },
          {
            attribute: 'title-width',
            explain: '表单标签的宽度',
            type: 'string',
            choosable: '',
            default: '80px'
          },
          {
            attribute: 'title-align',
            explain: '表单标签的对齐方式',
            type: 'string',
            choosable: 'left/right/top',
            default: 'right'
          },
          {
            attribute: 'line-height',
            explain: '表单标签及content的行高',
            type: 'string',
            choosable: '',
            default: '32px'
          },
          {
            attribute: 'item-gutter',
            explain: '表单元素的间距',
            type: 'string',
            choosable: '',
            default: '0'
          },
          {
            attribute: 'rowledge',
            explain: '表单元素的行距',
            type: 'string',
            choosable: '',
            default: '24px'
          },
          {
            attribute: 'response',
            explain: '表单是否支持响应式，只在手机端生效',
            type: 'boolean',
            choosable: '',
            default: 'true'
          },
          {
            attribute: 'focus-stop',
            explain: '是否停止聚焦处理，为true时不会抛出事件',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'focus-pause',
            explain: '是否暂停聚焦处理，为true时会抛出focus-prev/focus-next事件',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'focus-text-all-selected',
            explain: '是否在聚焦文本时全选',
            type: 'boolean',
            choosable: '',
            default: 'true'
          },
          {
            attribute: 'focus-options',
            explain: '聚焦模式配置',
            type: 'object',
            choosable: '',
            default: 'false',
            code:
`
  {
    prevKeys: 'shift+enter', // string 聚焦上一个节点快捷键设置

    nextKeys: 'enter', // string 聚焦下一个节点快捷键设置

    skips: ['prop'], // string 需要跳过聚焦字段的prop集合

    loop: true // boolean 是否开启聚焦循环
  }

`
          }
        ],
        methods: [
          {
            attribute: 'validate',
            explain: '对整个表单进行校验的方法',
            default: ``,
            code:
`
  // 默认
  table.validate().then(res => {
    this.$message.success('校验通过!')
  }).catch(data => {
    this.$message.error('校验不通过!')
  })
`
          },
          {
            attribute: 'validateField',
            explain: '对单元格进行校验的方法',
            default: `prop, rule, row`
          },
          {
            attribute: 'clearValidate',
            explain: '移除表单项的校验结果',
            default: ``
          },
          {
            attribute: 'resetFields',
            explain: '重置表单，清除校验及状态',
            default: ``
          },
          {
            attribute: 'getFormData',
            explain: '获取表单数据的方法',
            default: ``
          },
          {
            attribute: 'focus',
            explain: '使 prop 对应节点聚焦，不传参数则聚焦第一个可聚焦节点节点',
            default: `prop`
          },
          {
            attribute: 'blur',
            explain: '使 prop 对应节点失焦',
            default: `prop`
          },
          {
            attribute: 'select',
            explain: '使 prop 对应节点选中',
            default: `prop`
          }
        ],
        events: [
          {
            attribute: 'validate',
            explain: '任一表单项被校验后触发',
            default: `[]`,
            code:
`
  [
    {
      prop: '', // 字段名
      message: '', // 校验不通过的信息
      row: '', // 源数据
      column: '', // 当前节点配置
    }
  ]
`
          },
          {
            attribute: 'focus',
            explain: '节点聚焦时触发',
            default: `prop`
          },
          {
            attribute: 'blur',
            explain: '节点失焦时触发',
            default: `prop`
          },
          {
            attribute: 'focus-prev',
            explain: '聚焦上一个节点时触发',
            default: `prop`
          },
          {
            attribute: 'focus-next',
            explain: '聚焦下一个节点时触发',
            default: `prop`
          }
        ]
      }
    }
  }
}
</script>
