<template>
  <div class="page-home page">
    <h2>Full 完整功能</h2>
    <p class="hint">
      包含表格行列拖动、快捷编辑、表格校验、复制粘贴、批量替换、高级搜索、排序、数据代理等功能
    </p>
    <section class="demo">
      <div class="section-content">
        <!-- <VRender :config="{name: 'form', children: [{name: 'form-item', children: [{name: 'input'}]}, {name: 'form-item', children: function(h) {return h('div', {}, 111)}}]}" />
        <VRender :config="{name: 'form'}">
          <VRender :config="{name: 'form-item'}">
            <VRender :config="{name: 'input'}" />
            <VRender :config="{name: 'date-picker'}" />
          </VRender>
        </VRender> -->
        <eff-table ref="table" v-bind="tableOptions" />
      </div>

    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="componentSnippet" />
          <CodeSnippet class="javascript" :code="mainSnippet" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
import mock from 'mockjs'
import axios from 'axios'

const mainSnippet = `
  export default {
    data() {
      return {
        tableOptions: {
          search: true,
          drag: true,
          edit: true,
          border: true,
          rowId: 'id',
          toolbarConfig: {
            columnControl: true,
            fullscreen: true,
            buttons: [
              { name: 'button', code: 'add_focus', children: '新增', props: { icon: 'el-icon-plus' }},
              { name: 'button', code: 'insert_focus', children: '插入', props: { icon: 'el-icon-plus' }},
              { name: 'button', code: 'delete', children: '直接删除', props: { icon: 'el-icon-delete' }},
              { name: 'button', code: 'mark_cancel', children: '删除/取消', props: { icon: 'el-icon-delete' }},
              { name: 'button', code: 'save', children: '保存', props: { icon: 'el-icon-check' }, status: 'success' }
            ]
          },
          proxyConfig: {
            request: {
              query: ({ page, sorts, filters, form }) => {
                const params = { ...form }
                return axios.get('url', params).catch(res => {
                  return mock.mock({
                    'array|5': [
                      {
                        'id|+1': 100,
                        'input|+1': 1,
                        'textarea': '@name',
                        'select': '1',
                        'date': '',
                        'tag': [],
                        'switch': '0',
                        'checkboxgroup': [],
                        'checkbox': false,
                        'popup': '@title',
                        'link': '@ctitle',
                        'url': 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
                      }
                    ]
                  }).array
                })
              },
              delete: ({ body }) => axios.post('url', body),
              save: ({ body }) => axios.post('url', body)
            }
          },
          columns: [
            {
              show: true,
              type: 'selection',
              width: 40,
              fixed: 'left'
            },
            {
              show: true,
              prop: 'input',
              title: '输入框',
              width: 100,
              config: { name: 'input' },
              sortable: true,
              search: {
                operator: true
              },
              rules: [{ validator: ({ value }) => !value && '不能为空' }],
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
              config: { name: 'switch', defaultValue: false },
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
              prop: 'tag',
              title: '标签',
              width: 100,
              search: true,
              cellRender: { name: 'tag' },
              config: { options: [{ value: '1', label: '选项1', type: 'success' }, { value: '2', label: '选项2', type: 'info' }] },
              edit: {
                render: { name: 'select', props: { multiple: true }}
              }
            },
            {
              show: true,
              title: '按钮',
              width: 100,
              fixed: 'right',
              config: { name: 'button', children: '操作' }
            }
          ]
        }
      }
    }
  }
  `

const componentSnippet = `
  <eff-table
    ref="table"
    v-bind="tableOptions"
  />
  `
export default {
  name: 'Full',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      mainSnippet,
      componentSnippet,
      disabled: false,
      options: [{ value: '1', label: '名称1' }, { value: '2', label: '名称2' }],
      tableOptions: {
        maxHeight: 400,
        search: true,
        drag: true,
        edit: true,
        showSummary: true,
        rowId: '_rowId',
        searchConfig: { remote: false },
        toolbarConfig: {
          height: 400,
          columnControl: true,
          fullscreen: true,
          subtotal: true,
          refresh: true,
          replace: true,
          columnBatchControl: true,
          editHistory: true,
          seniorQuery: true,
          buttons: [
            { name: 'button', code: 'add_focus', children: '新增', props: { icon: 'el-icon-plus' } },
            { name: 'button', code: 'insert_focus', children: '插入', props: { icon: 'el-icon-plus' } },
            { name: 'button', code: 'delete', children: '直接删除', props: { icon: 'el-icon-delete' } },
            { name: 'button', code: 'mark_cancel', children: '删除/取消', props: { icon: 'el-icon-delete' } }
          ]
        },
        proxyConfig: {
          request: {
            query: ({ page, sorts, filters, form }) => {
              // console.log('query', JSON.stringify({ page, sorts, filters, form }, null, 2))
              const params = { ...form }
              const pageNum = page.pageNum || 1
              const pageSize = page.pageSize || 10
              return axios.get('url', params).catch(res => {
                return {
                  list: mock.mock({
                    'array|500': [
                      {
                        'id|+1': 100,
                        'input|+1': 1,
                        'async': '',
                        'select': '1',
                        'date': '',
                        'switch': '0'
                      }
                    ]
                  }).array.slice((pageNum - 1) * pageSize, (pageNum - 1) * pageSize + pageSize),
                  pageNum,
                  pageSize,
                  total: 500
                }
              })
            },
            save: ({ body }) => axios.post('url', body)
          }
        },
        footerActionConfig: { showPager: true, showBorder: true, cacheName: 'full' },
        columns: [
          {
            show: true,
            type: 'selection',
            width: 40,
            fixed: 'left',
            selectable: ({ row }) => row.input === 2
          },
          {
            show: true,
            minWidth: 200,
            prop: 'input',
            title: '输入框',
            config: { name: 'input' },
            sortable: true,
            search: {
              operator: true
            },
            rules: [
              { required: true },
              { min: 3, max: 6 }
            ],
            edit: true
          },
          {
            show: true,
            minWidth: 100,
            prop: 'async',
            title: '异步校验',
            search: true,
            config: { name: 'input' },
            cellRender: {},
            rules: [{
              validator: ({ value }) => {
                return new Promise(resolve => setTimeout(() => resolve(value !== '666' && '编码有误，必须是666'), 200))
              }
            }],
            edit: { disabled: ({ row, rowIndex }) => (row.select === '2') }
          },
          {
            show: true,
            prop: 'select',
            title: '选择器',
            config: {
              name: 'select',
              options: () => this.options
            },
            edit: true,
            search: true,
            rules: [
              { required: true }
            ]
          },
          {
            show: true,
            prop: 'switch',
            title: '开关',
            config: { name: 'switch', defaultValue: false },
            edit: true,
            search: true
          },
          {
            show: true,
            prop: 'date',
            title: '日期',
            config: {
              name: 'date-picker', format: 'yyyy-MM-dd'
            },
            search: {
              operator: true
            },
            edit: true
          },
          // {
          //   show: true,
          //   prop: 'tag',
          //   title: '标签',
          //   width: 100,
          //   search: true,
          //   cellRender: { name: 'tag' },
          //   config: { options: [{ value: '1', label: '选项1', type: 'success' }, { value: '2', label: '选项2', type: 'info' }] },
          //   edit: {
          //     render: { name: 'select', props: { multiple: true }}
          //   }
          // },
          {
            show: true,
            title: '按钮',
            fixed: 'right',
            config: { name: 'button', children: '操作' }
          }
        ]
      }
    }
  }
}
</script>
