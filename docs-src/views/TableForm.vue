<template>
  <div class="page-home page">
    <h2>TableForm 搜索表单</h2>
    <p class="hint">
      通过设置 <span class="primary">form 插槽</span> 或 <span class="primary">item 插槽</span> 或 <span class="primary">formConfig: { items }" </span> 渲染表单<br>
      设置表格高度 <span class="primary">height: '100%'</span> 可以使表格自动撑满页面
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table v-bind="tableOptions" />
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
    <h3>保存搜索模板</h3>
    <CodeSnippet class="javascript" :code="jsCodeTemplate" />
    <section class="demo">
      <div class="section-content">
        <eff-table ref="table" v-bind="tableOptions1" />
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
    <h3>使用 form 插槽</h3>
    <p><span class="primary">form</span> 插槽 > <span class="primary">item</span> 插槽 > <span class="primary">itemRender</span> 配置</p>
    <section class="demo">
      <div class="section-content">
        <eff-table v-bind="tableOptions">
          <template #form="{data}">
            <v-form-item title="名字">
              <el-input v-model="data.name" v-auto-width placeholder="名字" />
            </v-form-item>
            <v-form-item title="年龄">
              <el-input v-model="data.age" v-auto-width placeholder="年龄" />
            </v-form-item>
            <div style="display: flex;">
              <v-form-item>
                <el-select v-model="data.sex" v-auto-width multiple collapse-tags placeholder="性别">
                  <el-option v-for="d in sexOptions" :key="d.sexValue" :value="d.sexValue" :label="d.sexName" />
                </el-select>
              </v-form-item>
              <v-form-item title="爱好" title-border>
                <el-select v-model="data.hobby" v-auto-width multiple collapse-tags placeholder="爱好">
                  <el-option v-for="d in hobbyOptions" :key="d.value" :value="d.value" :label="d.label" />
                </el-select>
              </v-form-item>
            </div>
          </template>
        </eff-table>
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode1" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>
    <h3>使用 item 插槽</h3>
    <section class="demo">
      <div class="section-content">
        <eff-table v-bind="tableOptions">
          <!-- 可以部分使用item插槽 -->
          <!-- <template #item_name="{data}">
            <el-input v-model="data.name" v-auto-width placeholder="名字" />
          </template> -->
          <template #item_age="{data}">
            <el-input v-model="data.age" v-auto-width placeholder="年龄" />
          </template>
          <template #item_sex="{data}">
            <el-select v-model="data.sex" v-auto-width multiple collapse-tags placeholder="性别">
              <el-option v-for="d in sexOptions" :key="d.sexValue" :value="d.sexValue" :label="d.sexName" />
            </el-select>
          </template>
          <template #item_hobby="{data}">
            <el-select v-model="data.hobby" v-auto-width multiple collapse-tags placeholder="爱好">
              <el-option v-for="d in hobbyOptions" :key="d.value" :value="d.value" :label="d.label" />
            </el-select>
          </template>
        </eff-table>
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode2" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table v-bind="tableOptions" />
  `
const htmlCode1 = `
  <eff-table v-bind="tableOptions">
    <template #form="{data}">
      <v-form-item title="名字">
        <el-input v-model="data.name" v-auto-width placeholder="名字" />
      </v-form-item>
      <v-form-item title="年龄">
        <el-input v-model="data.age" v-auto-width placeholder="年龄" />
      </v-form-item>
      <div style="display: flex;">
        <v-form-item>
          <el-select v-model="data.sex" v-auto-width multiple collapse-tags placeholder="性别">
            <el-option v-for="d in sexOptions" :key="d.sexValue" :value="d.sexValue" :label="d.sexName" />
          </el-select>
        </v-form-item>
        <v-form-item title="爱好" title-border>
          <el-select v-model="data.hobby" v-auto-width multiple collapse-tags placeholder="爱好">
            <el-option v-for="d in hobbyOptions" :key="d.value" :value="d.value" :label="d.label" />
          </el-select>
        </v-form-item>
      </div>
    </template>
  </eff-table>
  `
const htmlCode2 = `
  <eff-table v-bind="tableOptions1">
    <!-- 可以部分使用item插槽 -->
    <!-- <template #item_name="{data}">
      <el-input v-model="data.name" v-auto-width placeholder="名字" />
    </template> -->
    <template #item_age="{data}">
      <el-input v-model="data.age" v-auto-width placeholder="年龄" />
    </template>
    <template #item_sex="{data}">
      <el-select v-model="data.sex" v-auto-width multiple collapse-tags placeholder="性别">
        <el-option v-for="d in sexOptions" :key="d.sexValue" :value="d.sexValue" :label="d.sexName" />
      </el-select>
    </template>
    <template #item_hobby="{data}">
      <el-select v-model="data.hobby" v-auto-width multiple collapse-tags placeholder="爱好">
        <el-option v-for="d in hobbyOptions" :key="d.value" :value="d.value" :label="d.label" />
      </el-select>
    </template>
  </eff-table>
  `
const jsCodeTemplate = `
  // main.js
  import 'EffTable' from 'eff-table'
  import api from './api'
  Vue.use(EffTable)
  // 全局配置表单接口
  EffTable.Table.props.formRequest.default = () => ({
    // 函数在eff-table内调用，这里返回配置好参数的api
    query: ({ formRequestParams }) => api.query(formRequestParams),
    add: ({ name, value, formRequestParams }) => api.add(Object.assign({ name, value }, formRequestParams)),
    delete: ({ row, formRequestParams }) => api.deleted({ type: formRequestParams.type, id: row.id })
  })

  // js
  tableOptions: {
    formConfig: {
      isSave: true,
      formRequestParams: { type: 1 },
      ...
    }
  }
  `
const jsCode = `
  export default {
    data() {
      return {
        list: [],
        sexOptions: [{ sexName: '男', sexValue: '0' }, { sexName: '女', sexValue: '1' }],
        hobbyOptions: [{ label: '游泳', value: '0' }, { label: '乒乓球', value: '1' }, { label: '到公园跑步', value: '2' }],
        tableOptions: {
          border: true,
          proxyConfig: {
            request: {
              query: ({ page, sorts, filters, form }) => {
                // 模拟数据
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
            defaultValue: {
              name: '',
              age: '',
              sex: [],
              hobby: []
            },
            isSave: true,
            formRequestParams: { type: 1 },
            items: [
              { title: '名字', prop: 'name', itemRender: { name: 'input', directives: [{ name: 'auto-width' }] }},
              { title: '年龄', prop: 'age', itemRender: { name: 'input', directives: [{ name: 'auto-width' }], 
                props: { controlsPosition: 'right' }}},
              { title: '性别', prop: 'sex', showTitle: false, options: () => this.sexOptions, label: 'sexName', value: 'sexValue', 
                itemRender: { name: 'select', directives: [{ name: 'auto-width' }], props: { multiple: true, collapseTags: true }}},
              { title: '爱好', prop: 'hobby', titleBorder: true, options: () => this.hobbyOptions, 
                itemRender: { name: 'select', directives: [{ name: 'auto-width' }], props: { multiple: true, collapseTags: true }}}
            ]
          },
          columns: [
            { type: 'selection' },
            { prop: 'name', title: '名字' },
            { prop: 'age', title: '年龄' },
            { prop: 'sexName', title: '性别' },
            { prop: 'hobbyName', title: '爱好' },
            { title: '操作', cellRender: (h, { row }) => {
              return <el-button type='text'>删除</el-button>
            } }
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
        tableOptions: {
          border: true,
          proxyConfig: {
            request: {
              query: ({ page, sorts, filters, form }) => {
                // 模拟数据
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
          // formRequest: { // object 使用保存模板时的接口配置，可以在注册eff-table组件时统一设置
          //   // 函数在eff-table内调用，这里返回配置好参数的api
          //   query: ({ formRequestParams }) => api.query(formRequestParams),
          //   add: ({ name, value, formRequestParams }) => api.add(Object.assign({ name, value }, formRequestParams)),
          //   delete: ({ row, formRequestParams }) => api.deleted({ type: formRequestParams.type, id: row.id })
          // },
          formConfig: {
            defaultValue: {
              name: '',
              age: '',
              sex: ['0', '1'],
              filter_sex: ['0'],
              hobby: ['0', '1', '2']
            },
            isSave: true,
            formRequestParams: { type: 1 },
            items: [
              { title: '名字', prop: 'name', itemRender: { name: 'input', directives: [{ name: 'auto-width' }] }},
              { title: '年龄', prop: 'age', itemRender: { name: 'input', directives: [{ name: 'auto-width' }],
                props: { controlsPosition: 'right' }}},
              { title: '性别', prop: 'sex', showTitle: false, options: () => this.sexOptions, label: 'sexName', value: 'sexValue',
                itemRender: { name: 'select', directives: [{ name: 'auto-width' }], props: { multiple: true, collapseTags: true }}},
              { title: '爱好', prop: 'hobby', titleBorder: true, options: () => this.hobbyOptions,
                itemRender: { name: 'select', directives: [{ name: 'auto-width' }], props: { multiple: true, collapseTags: true }}}
            ]
          },
          columns: [
            { type: 'selection' },
            { prop: 'name', title: '名字' },
            { prop: 'age', title: '年龄' },
            { prop: 'sexName', title: '性别' },
            { prop: 'hobbyName', title: '爱好' },
            { title: '操作', cellRender: (h, { row }) => {
              return <el-button type='text'>删除</el-button>
            } }
          ]
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
      htmlCode2,
      jsCode,
      jsCode1,
      jsCodeTemplate,
      list: [],
      sexOptions: [{ sexName: '男', sexValue: '0' }, { sexName: '女', sexValue: '1' }],
      hobbyOptions: [{ label: '游泳', value: '0' }, { label: '乒乓球', value: '1' }, { label: '到公园跑步', value: '2' }],
      tableOptions: {
        border: true,
        proxyConfig: {
          request: {
            query: ({ page, sorts, filters, form }) => {
              // 模拟数据
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
          defaultValue: {
            name: '',
            age: '',
            sex: [],
            hobby: []
          },
          items: [
            { title: '名字', prop: 'name', itemRender: { name: 'input', directives: [{ name: 'auto-width' }] }},
            { title: '年龄', prop: 'age', itemRender: { name: 'input', directives: [{ name: 'auto-width' }],
              props: { controlsPosition: 'right' }}},
            { title: '性别', prop: 'sex', showTitle: false, options: () => this.sexOptions, label: 'sexName', value: 'sexValue',
              itemRender: { name: 'select', directives: [{ name: 'auto-width' }], props: { multiple: true, collapseTags: true }}},
            { title: '爱好', prop: 'hobby', titleBorder: true, options: () => this.hobbyOptions,
              itemRender: { name: 'select', directives: [{ name: 'auto-width' }], props: { multiple: true, collapseTags: true }}}
          ]
        },
        columns: [
          { type: 'selection' },
          { prop: 'name', title: '名字' },
          { prop: 'age', title: '年龄' },
          { prop: 'sexName', title: '性别' },
          { prop: 'hobbyName', title: '爱好' },
          { title: '操作', cellRender: (h, { row }) => {
            return <el-button type='text'>删除</el-button>
          } }
        ]
      },
      tableOptions1: {
        border: true,
        proxyConfig: {
          request: {
            query: ({ page, sorts, filters, form }) => {
              // 模拟数据
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
        // formRequest: { // object 使用保存模板时的接口配置，可以在注册eff-table组件时统一设置
        //   // 函数在eff-table内调用，这里返回配置好参数的api
        //   query: ({ formRequestParams }) => api.query(formRequestParams),
        //   add: ({ name, value, formRequestParams }) => api.add(Object.assign({ name, value }, formRequestParams)),
        //   delete: ({ row, formRequestParams }) => api.deleted({ type: formRequestParams.type, id: row.id })
        // },
        formConfig: {
          defaultValue: {
            name: '',
            age: '',
            sex: ['0', '1'],
            filter_sex: ['0'],
            hobby: ['0', '1', '2']
          },
          isSave: true,
          formRequestParams: { type: 1 },
          items: [
            { title: '名字', prop: 'name', itemRender: { name: 'input', directives: [{ name: 'auto-width' }] }},
            { title: '年龄', prop: 'age', itemRender: { name: 'input', directives: [{ name: 'auto-width' }],
              props: { controlsPosition: 'right' }}},
            { title: '性别', prop: 'sex', showTitle: false, options: () => this.sexOptions, label: 'sexName', value: 'sexValue',
              itemRender: { name: 'select', directives: [{ name: 'auto-width' }], props: { multiple: true, collapseTags: true }}},
            { title: '爱好', prop: 'hobby', titleBorder: true, options: () => this.hobbyOptions,
              itemRender: { name: 'select', directives: [{ name: 'auto-width' }], props: { multiple: true, collapseTags: true }}}
          ]
        },
        columns: [
          { type: 'selection' },
          { prop: 'name', title: '名字' },
          { prop: 'age', title: '年龄' },
          { prop: 'sexName', title: '性别' },
          { prop: 'hobbyName', title: '爱好' },
          { title: '操作', cellRender: (h, { row }) => {
            return <el-button type='text'>删除</el-button>
          } }
        ]
      }
    }
  }
}
</script>
