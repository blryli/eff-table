<template>
  <div class="page-home page">
    <h2>Transfer 穿梭框 <router-link class="page-router" to="/Transfer">查看示例</router-link></h2>
    <Document :form="documentForm" />
  </div>
</template>

<script>
import Document from '../../components/Document.vue'

export default {
  name: 'TransferApi',
  components: {
    Document
  },

  data() {
    return {
      documentForm: {
        props: [
          {
            attribute: 'value / v-model',
            explain: '绑定值',
            type: 'array',
            choosable: '',
            default: '[]'
          },
          {
            attribute: 'data',
            explain: 'Transfer 的数据源',
            type: 'array',
            choosable: '',
            default: '[]',
            code:
`
  // 字段名默认如下，可以用字段别名修改默认字段名
  [
    {
      key: '',
      label: '',
      disabled: false,
      children: []
    }
  ]
`
          },
          {
            attribute: 'titles',
            explain: '自定义列表标题',
            type: 'array',
            choosable: '',
            default: "['from', 'to']"
          },
          {
            attribute: 'button-texts',
            explain: '自定义按钮文案',
            type: 'array',
            choosable: '',
            default: '[]'
          },
          {
            attribute: 'props',
            explain: '数据源的字段别名',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    key: 'key',
    label: 'label',
    disabled: 'disabled', // 禁用字段名
    children: 'children' // 子集字段名
  }
`
          },
          {
            attribute: 'default-checked-keys',
            explain: '默认勾选的 key 数组',
            type: 'array',
            choosable: '',
            default: '[]'
          },
          {
            attribute: 'default-expanded-keys',
            explain: '默认展开的 key 数组',
            type: 'array',
            choosable: '',
            default: '[]'
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
