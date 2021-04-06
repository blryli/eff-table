<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :form.sync="form"
          :loading="loading"
          search
          drag
          edit
          column-control
          border
          fullscreen
        />
        {{ form }}
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
import { formatDate } from '@/utils'

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
      loading: false,
      data: [],
      form: {},
      columns: [
        {
          show: true,
          prop: 'input',
          title: '输入框',
          width: 100,
          search: true,
          edit: true
        },
        {
          show: true,
          prop: 'textarea',
          title: '文本框',
          width: 100,
          search: {
            operator: true
          },
          edit: {
            render: { name: 'textarea' }
          }
        },
        {
          show: true,
          prop: 'select',
          title: '选择器',
          width: 100,
          edit: {
            render: { name: 'select', options: [{ value: '1', label: '选项1' }, { value: '2', label: '选项2' }], props: { clearable: true, placeholder: '请选择' }}
          }
        },
        {
          show: true,
          prop: 'date',
          title: '日期',
          width: 100,
          cellRender: (h, { prop, row }) => {
            return formatDate(row[prop], 'yyyy-MM-dd')
          },
          edit: {
            render: { name: 'date-picker', props: { type: 'date', placeholder: '选择日期' }}
          }
        },
        {
          show: true,
          prop: 'link',
          title: '文字链接',
          width: 100,
          cellRender: { name: 'link', props: { url: '' }},
          edit: {
            render: { name: 'dialog', props: { visible: true }, on: { save: () => { console.log('save') } }, children: [{ name: 'form' }] }
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
          prop: 'button',
          title: '按钮',
          width: 100,
          cellRender: { name: 'button', content: '操作' }
        },
        {
          show: true,
          prop: 'button',
          title: '气泡',
          width: 100,
          cellRender: { name: 'popover', children: [{ name: 'div', content: 'popover', slot: 'reference' }] }
        },
        {
          show: true,
          prop: 'datetime',
          title: '核酸检测时间',
          width: 100
        }
      ]
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.data = mock.mock({
        'array|5': [
          {
            'input': '@city',
            'textarea': '',
            'select': '',
            'date': '',
            'link': '@ctitle',
            'url': 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          }
        ]
      }).array
      this.loading = false
    }, 200)
  }
}
</script>
