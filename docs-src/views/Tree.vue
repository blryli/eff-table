<template>
  <div class="page-home page">
    <h2>Tree 树</h2>
    <p class="hint">
      tree-config对象的<span class="primary">children</span>属性指定子集， 通过<span class="primary">rowId</span>指定主键
      <br>
    </p>

    <section class="demo">
      <div class="section-content">
        <eff-table ref="table" v-bind="tableOptions" />
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

    <h3>懒加载</h3>
    <p>
      配置 <span class="primary">rowId</span> 和 <span class="primary">tree-config={ lazy, loadMethod }</span>  加载方法来开启树形懒加载
    </p>
    <p>
      通过 <span class="primary">hasChild</span> 属性来标识是否存在子节点，从而控制该节点是否允许被点击
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table ref="table" v-bind="tableOptions1" />
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

const jsCode = `
  export default {
    data() {
      return {
        tableOptions: {
          maxHeight: 400,
          rowId: 'id',
          treeConfig: { children: 'children' },
          columns: [
            {
              show: true,
              prop: 'id',
              title: 'ID'
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
            }
          ],
          data: [
            { id: 1, name: '张三', sex: '男', phone: '13715201314', children: [
              { id: 100, name: '小张三', sex: '男', phone: '13715201314', children: [
                { id: 1000, name: '小张三', sex: '男', phone: '13715201314' },
                { id: 1001, name: '张三小', sex: '男', phone: '13715201314' }
              ] },
              { id: 101, name: '张三小', sex: '男', phone: '13715201314' }
            ] },
            { id: 2, name: '李四', sex: '女', phone: '13715201314' },
            { id: 3, name: '王五', sex: '男', phone: '13715201314', children: [
              { id: 200, name: '小张三', sex: '男', phone: '13715201314', children: [
                { id: 2000, name: '小张三', sex: '男', phone: '13715201314' },
                { id: 2001, name: '张三小', sex: '男', phone: '13715201314' }
              ] },
              { id: 201, name: '张三小', sex: '男', phone: '13715201314' }
            ] },
            { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
            { id: 5, name: '赵六', sex: '女', phone: '13715201314' }
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
        tableOptions1: {
          maxHeight: 400,
          rowId: 'id',
          treeConfig: { children: 'children', lazy: true, loadMethod: this.loadMethod },
          columns: [
            {
              show: true,
              prop: 'id',
              title: 'ID'
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
            }
          ],
          data: [
            { id: 1, name: '张三', sex: '男', phone: '13715201314', hasChild: true },
            { id: 2, name: '李四', sex: '女', phone: '13715201314' },
            { id: 3, name: '王五', sex: '男', phone: '13715201314', hasChild: true },
            { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
            { id: 5, name: '赵六', sex: '女', phone: '13715201314' }
          ]
        }
      }
    },
    methods: {
      loadMethod({ row }) {
        return new Promise(resolve => {
          setTimeout(() => {
            const childs = [
              { id: row.id + 1000, name: row.name + 'Test45', sex: '男', phone: null, hasChild: true },
              { id: row.id + 1500, name: row.name + 'Test56', sex: '女', phone: null, hasChild: false }
            ]
            resolve(childs)
          }, 1000)
        })
      }
    }
  }
  `

const htmlCode = `
  <eff-table ref="table" v-bind="tableOptions" />
  `
const htmlCode1 = `
  <eff-table ref="table" v-bind="tableOptions1" />
  `

export default {
  name: 'Tree',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      jsCode,
      jsCode1,
      htmlCode,
      htmlCode1,
      tableOptions: {
        maxHeight: 400,
        rowId: 'id',
        treeConfig: { children: 'children' },
        columns: [
          {
            show: true,
            prop: 'id',
            title: 'ID'
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
          }
        ],
        data: [
          { id: 1, name: '张三', sex: '男', phone: '13715201314', children: [
            { id: 100, name: '小张三', sex: '男', phone: '13715201314', children: [
              { id: 1000, name: '小张三', sex: '男', phone: '13715201314' },
              { id: 1001, name: '张三小', sex: '男', phone: '13715201314' }
            ] },
            { id: 101, name: '张三小', sex: '男', phone: '13715201314' }
          ] },
          { id: 2, name: '李四', sex: '女', phone: '13715201314' },
          { id: 3, name: '王五', sex: '男', phone: '13715201314', children: [
            { id: 200, name: '小张三', sex: '男', phone: '13715201314', children: [
              { id: 2000, name: '小张三', sex: '男', phone: '13715201314' },
              { id: 2001, name: '张三小', sex: '男', phone: '13715201314' }
            ] },
            { id: 201, name: '张三小', sex: '男', phone: '13715201314' }
          ] },
          { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
          { id: 5, name: '赵六', sex: '女', phone: '13715201314' }
        ]
      },
      tableOptions1: {
        maxHeight: 400,
        rowId: 'id',
        treeConfig: { children: 'children', lazy: true, loadMethod: this.loadMethod },
        columns: [
          {
            show: true,
            prop: 'id',
            title: 'ID'
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
          }
        ],
        data: [
          { id: 1, name: '张三', sex: '男', phone: '13715201314', hasChild: true },
          { id: 2, name: '李四', sex: '女', phone: '13715201314' },
          { id: 3, name: '王五', sex: '男', phone: '13715201314', hasChild: true },
          { id: 4, name: '赵六', sex: '男', phone: '13715201314' },
          { id: 5, name: '赵六', sex: '女', phone: '13715201314' }
        ]
      }
    }
  },
  methods: {
    loadMethod({ row }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const childs = [
            { id: row.id + 1000, name: row.name + 'Test45', sex: '男', phone: null, hasChild: true },
            { id: row.id + 1500, name: row.name + 'Test56', sex: '女', phone: null, hasChild: false }
          ]
          resolve(childs)
        }, 1000)
      })
    }
  }
}
</script>
