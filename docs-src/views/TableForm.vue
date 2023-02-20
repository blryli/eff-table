<template>
  <div class="page-home page">
    <h2>TableForm 搜索表单</h2>
    <p class="hint">
      通过设置 <span class="primary">form 插槽</span> 或 <span class="primary">form-config="{ items }" </span> 渲染表单
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-bind="tableOptions"
        >
          <template #item_name="{data}">
            <el-input v-model="data.name" />
            <el-button>点位</el-button>
          </template>
        </eff-table>
      </div>
    </section>
    <!-- <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>
    <h3>对象配置模式</h3>
    <section class="demo">
      <div class="section-content">
        <eff-table
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
    </section> -->
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table
    v-model="columns"
    :data="data"
    border
  >
  </eff-table>
  `
const htmlCode1 = `
  <eff-table v-bind="tableOptions" />
  `
const jsCode = `
  export default {
    data() {
      return {
        columns: [
          {
            show: true,
            type: 'expand',
            width: 40,
          },
          {
            show: true,
            prop: 'name',
            title: '名字'
          },
          {
            show: true,
            prop: 'sex',
            title: '性别'
          },
          {
            show: true,
            prop: 'phone',
            title: '手机'
          },
          {
            show: true,
            prop: 'email',
            title: '邮箱'
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
          columns: [
            {
              show: true,
              type: 'expand',
              width: 40
            },
            {
              show: true,
              prop: 'name',
              title: '名字'
            },
            {
              show: true,
              prop: 'sex',
              title: '性别'
            },
            {
              show: true,
              prop: 'phone',
              title: '手机'
            },
            {
              show: true,
              prop: 'email',
              title: '邮箱'
            }
          ],
          data: [
            { id: 1, name: '张三', sex: '男', phone: '13715201314', email: 'aaa@qq.com' },
            { id: 2, name: '李四', sex: '女', phone: '13715201314', email: 'aaa@qq.com' },
            { id: 3, name: '王五', sex: '男', phone: '13715201314', email: 'aaa@qq.com' },
            { id: 4, name: '赵六', sex: '男', phone: '13715201314', email: 'aaa@qq.com' }
          ],
          scopedSlots: { expand: ({ row }) => {
            return (
              <v-form
                data={row}
                columns={[
                  { title: '名字', prop: 'name' },
                  { title: '性别', prop: 'sex' },
                  { title: '手机', prop: 'phone' },
                  { title: '邮箱', prop: 'email' }
                ]}
              />
            )
          } }
        }
      }
    }
  }
  `
export default {
  name: 'TableForm',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      htmlCode1,
      jsCode,
      jsCode1,
      list: [],
      templateId: 3,
      templateList: [
        { id: 1, name: '模板1', value: { name: '张三' }},
        { id: 2, name: '模板2', value: { name: '李四', sex: ['1'] }}
      ],
      tableOptions: {
        border: true,
        height: '100%',
        toolbarConfig: { fullscreen: true, refresh: true },
        proxyConfig: {
          request: {
            query: ({ page, sorts, filters, form }) => {
              // console.log('form', form)
              return [
                { id: 5, name: '张三', age: '22', sex: '0', sexName: '男', hobby: '0', hobbyName: '游泳' },
                { id: 2, name: '李四', age: '18', sex: '1', sexName: '女', hobby: '1', hobbyName: '乒乓球' },
                { id: 3, name: '王五', age: '24', sex: '0', sexName: '男', hobby: '2', hobbyName: '到公园跑步' },
                { id: 4, name: '赵六', age: '28', sex: '0', sexName: '男', hobby: '0', hobbyName: '游泳' }
              ].filter(da => {
                const list = []
                for (const prop in form) {
                  if (prop) {
                    const val = form[prop]
                    const values = val ? (Array.isArray(val) ? val : [val]) : []
                    list.push({ prop, values })
                  }
                }
                return list.every(item => {
                  const { prop, values } = item
                  const rowValue = da[prop]
                  if (values.length) {
                    return values.some(d => rowValue.indexOf(d) > -1)
                  }
                  return true
                })
              })
            }
          }
        },
        formConfig: {
          titleWidth: 'auto',
          itemGutter: 10,
          defaultValue: {
            name: '',
            age: '',
            sex: [],
            hobby: []
          },
          isSave: true,
          api: {
            query: () => Promise.resolve(this.templateList),
            add: ({ name, value }) => new Promise(resolve => {
              this.templateId++
              this.templateList.push({ id: this.templateId, name, value })
              resolve()
            }),
            delete: (row) => new Promise(resolve => {
              const index = this.templateList.findIndex(d => d.id === row.id)
              this.templateList.splice(index, 1)
              resolve()
            })
          },
          items: [
            { title: '名字', prop: 'name', itemRender: { name: 'input', autoWidth: true }},
            { title: '年龄', prop: 'age', itemRender: { name: 'input', autoWidth: true, props: { controlsPosition: 'right' }}},
            { title: '性别', prop: 'sex', showTitle: false, itemRender: { name: 'select', autoWidth: true, options: [{ sexName: '男', sexValue: '0' }, { sexName: '女', sexValue: '1' }], props: { labelKey: 'sexName', valueKey: 'sexValue', multiple: true, collapseTags: true }}},
            { title: '爱好', prop: 'hobby', titleBorder: true, itemRender: { name: 'select', autoWidth: true, options: () => [{ label: '游泳', value: '0' }, { label: '乒乓球', value: '1' }, { label: '到公园跑步', value: '2' }], props: { labelKey: 'label', valueKey: 'value', multiple: true, collapseTags: true }}}
          ]
        },
        search: true,
        columns: [
          { type: 'selection' },
          { prop: 'name', title: '名字', search: true },
          { prop: 'age', title: '年龄', search: true },
          { prop: 'sexName', title: '性别', search: true },
          { prop: 'hobbyName', title: '爱好', search: true },
          { title: '操作', cellRender: (h, { row }) => {
            return <el-button type='text'>删除</el-button>
          } }
        ]
      }
    }
  }
}
</script>
