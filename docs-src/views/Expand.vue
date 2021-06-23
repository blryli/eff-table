<template>
  <div class="page-home page">
    <h2>Expand 展开行</h2>
    <p class="hint">
      当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能。
    </p>
    <p>通过设置 type="expand" 和 scope slot 可以开启展开行功能（展开行不能用于虚拟滚动）</p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :max-height="400"
          border
        >
          <template #expand="{row}">
            <v-form
              :data="row"
              :columns="[
                {title: '名字', prop: 'name'},
                {title: '性别', prop: 'sex'},
                {title: '手机', prop: 'phone'},
                {title: '邮箱', prop: 'email'},
              ]"
            />
          </template>
        </eff-table>
      </div>
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
    </section>
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
  <v-form
    :data="row"
    :columns="[
      {title: '名字', prop: 'name'},
      {title: '性别', prop: 'sex'},
      {title: '手机', prop: 'phone'},
      {title: '邮箱', prop: 'email'},
    ]"
  />
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
            width: 60,,
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
              width: 60
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
  name: 'Expand',
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
      columns: [
        {
          show: true,
          type: 'expand',
          width: 60
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
      tableOptions: {
        columns: [
          {
            show: true,
            type: 'expand',
            width: 60
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
</script>

