<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-bind="tableOptions"
          v-on="tableOns"
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

`

const componentSnippet = `
<eff-table
  v-model="columns"
  :data="data"
  drag
  column-control
  row-drag
  border
  fullscreen
/>
`
export default {
  name: 'Render',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      mainSnippet,
      componentSnippet,
      tableOptions: {
        data: [],
        form: {},
        columns: [
          {
            show: true,
            prop: 'input',
            title: '输入框',
            width: 100,
            config: { name: 'input' },
            search: {
              operator: true
            },
            edit: true
          },
          {
            show: true,
            prop: 'textarea',
            title: '文本框',
            width: 100,
            search: true,
            edit: {
              render: { name: 'textarea', on: { input: val => { console.log({ val }) } }}
            }
          },
          {
            show: true,
            prop: 'popup',
            title: '气泡',
            width: 100,
            config: { name: 'popup', props: { content: '飘起来' }, children: [{ name: 'input', attrs: { autofocus: true }}] },
            edit: true
          },
          {
            show: true,
            prop: 'select',
            title: '选择器',
            width: 100,
            config: {
              name: 'select', options: [{ value: '1', label: '选项1' }, { value: '2', label: '选项2' }]
            },
            edit: true,
            search: true
          },
          {
            show: true,
            prop: 'switch',
            title: '开关',
            width: 100,
            config: { name: 'switch' },
            edit: true,
            search: true
          },
          {
            show: true,
            prop: 'date',
            title: '日期',
            width: 160,
            config: {
              name: 'date-picker', format: 'yyyy-MM-dd'
            },
            search: {
              operator: true
            },
            edit: true
          },
          {
            show: true,
            prop: 'link',
            title: '文字链接',
            width: 100,
            search: true,
            cellRender: { name: 'link', props: { url: '' }},
            edit: {
              render: { name: 'dialog', props: { visible: false }, children: [{ name: 'form' }] }
            }
          },
          {
            show: true,
            prop: 'url',
            title: '图片',
            width: 100,
            cellRender: { name: 'image' }
          },
          {
            show: true,
            prop: 'checkboxgroup',
            title: '多选框组',
            width: 160,
            config: { name: 'checkbox-group', children: [
              { name: 'checkbox', props: { label: '深圳' }},
              { name: 'checkbox', props: { label: '广州' }}
            ] }
          },
          {
            show: true,
            prop: 'checkbox',
            title: '多选框',
            width: 100,
            config: { name: 'checkbox', content: '选项' }
          },
          {
            show: true,
            prop: 'button',
            title: '按钮',
            width: 100,
            config: { name: 'button', content: '操作' }
          }
        ],
        search: true,
        drag: true,
        edit: true,
        columnControl: true,
        border: true,
        fullscreen: true,
        loading: false
      },
      proxyConfig: {},
      tableOns: {
        input: val => {
          console.log('input')
          this.tableOptions.value = [...val]
        },
        'update:form': val => {
          console.log('update:form')
          this.tableOptions.form = { ...val }
        }
      }
    }
  },
  mounted() {
    this.tableOptions.loading = true
    setTimeout(() => {
      this.tableOptions.data = mock.mock({
        'array|5': [
          {
            'input|+1': 1,
            'textarea': '@name',
            'select': '1',
            'date': '',
            'switch': false,
            'checkboxgroup': [],
            'checkbox': false,
            'popup': '@title',
            'link': '@ctitle',
            'url': 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          }
        ]
      }).array
      this.tableOptions.loading = false
    }, 200)
  }
}
</script>
