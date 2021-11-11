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
            attribute: 'tree-config',
            explain: '树配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    lazy: false, // 是否使用懒加载
    loadMethod: ({ row }) => {}, // 懒加载方法，使用懒加载时必须传入该函数
  }
  `
          },
          {
            attribute: 'default-checked-keys',
            explain: '默认勾选的 key 集合',
            type: 'array',
            choosable: '',
            default: '[]'
          },
          {
            attribute: 'default-expanded-keys',
            explain: '默认展开的 key 集合',
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
            default: `{ rightKeys, dir, changeKeys }`,
            code:
`
  {
    rightKeys: '', // array 右侧面板存在的节点key集合
    dir: '', // string 穿梭的方向 left/right
    changeKeys: '' // array 变化节点的key集合
  }
  `
          },
          {
            attribute: 'left-check-change',
            explain: '左侧列表元素选中 / 取消选中时触发',
            default: `{ checkedKeys, changeKeys }`,
            code:
`
  {
    checkedKeys: '', // array 左侧列表选中的节点key集合
    changeKeys: '' // array 变化节点的key集合
  }
  `
          },
          {
            attribute: 'right-check-change',
            explain: '右侧列表元素选中 / 取消选中时触发',
            default: `{ checkedKeys, changeKeys }`,
            code:
`
  {
    checkedKeys: '', // array 右侧列表选中的节点key集合
    changeKeys: '' // array 变化节点的key集合
  }
  `
          },
          {
            attribute: 'lazy-data',
            explain: '懒加载元素加载完成后触发',
            default: `{ panel, id, data }`,
            code:
`
  {
    panel: '', // left/right 加载节点的面板
    id: '', // 加载节点的id
    data: '' // 加载的数据
  }
  `
          }
        ]
      }
    }
  }
}
</script>
