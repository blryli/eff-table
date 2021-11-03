<template>
  <div class="page-home page">
    <h2>Drag 拖动</h2>
    <p class="hint">
      列拖动前置条件<br>
      <span class="primary">drag</span> 属性设置为
      <span class="primary"> true </span><br>
      <span class="primary">border</span> 属性设置为
      <span class="primary"> true </span><br>
      支持多表头同时拖动，按住<span class="primary"> ctrl </span>点击表头进行多选，可对多列进行拖动操作
    </p>

    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          drag
          edit
          border
        />
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

    <h3>列控制</h3>
    <p>
      toolbar-config 配置 <span class="primary">column-control</span> 属性设置为
      <span class="primary"> true </span>，点击功能图标 <Icon icon="column-ctrl" /> 开启列控制功能（显示/隐藏）
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns1"
          :data="data"
          drag
          :toolbar-config="{columnControl: true}"
          border
        />
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

    <h3>右键列控制</h3>
    <p>
      <span class="primary">header-contextmenu</span> 属性设置为
      <span class="primary"> true </span>， 开启右键列控制功能（移动/固定/显示/隐藏）
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns2"
          :data="data1"
          drag
          header-contextmenu
          :toolbar-config="{columnControl: true}"
          border
        />
      </div>
    </section>
    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode4" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>

    <h3>列批量控制</h3>
    <p>
      <span class="primary">column-batch-control</span> 属性设置为
      <span class="primary"> true </span>，点击功能图标 <Icon icon="column-batch-ctrl" /> 开启列批量控制功能（显示/隐藏、排序、列固定）
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns2"
          :data="data1"
          drag
          :toolbar-config="{columnBatchControl: true}"
          border
        />
      </div>
    </section>
    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode2" />
          <CodeSnippet class="javascript" :code="jsCode1" />
        </div>
      </Collapse>
    </section>

    <h3>行拖动</h3>
    <p>
      <span class="primary">row-drag</span> 属性设置为
      <span class="primary"> true </span>，开启行拖动功能，通过拖动列图标&nbsp;<Icon icon="row-drag" />&nbsp;使用行拖动
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns3"
          :data="data"
          row-drag
        />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode3" />
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
  <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    drag
    border
  />
  `
const htmlCode1 = `
  <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    drag
    :toolbar-config="{columnControl: true}"
    border
  />
  `
const htmlCode2 = `
 <eff-table
    ref="table"
    v-model="columns1"
    :data="data1"
    drag
    :toolbar-config="{columnBatchControl: true}"
    border
  />
  `
const htmlCode3 = `
  <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    row-drag
  />
  `
const htmlCode4 = `
  <eff-table
    ref="table"
    v-model="columns1"
    :data="data1"
    drag
    header-contextmenu
    :toolbar-config="{columnControl: true}"
    border
  />
  `

const jsCode = `
  export default {
    data() {
      return {
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
        columns1: [
          {
            show: true,
            prop: 'name',
            title: '名字',
            width: 200
          },
          {
            show: true,
            prop: 'id',
            title: 'ID',
            fixed: 'left',
            width: 100
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            width: 200
          },
          {
            show: true,
            prop: 'age',
            title: '年龄',
            width: 200
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            width: 200
          },
          {
            show: true,
            prop: 'height',
            title: '身高',
            fixed: 'right',
            width: 100
          },
          {
            show: true,
            prop: 'weight',
            title: '体重',
            width: 200
          }
        ],
        data1: [
          { id: 1, name: '张三', age: '18', sex: '男', phone: '13715201314', height: '180', weight: '140' },
          { id: 2, name: '李四', age: '18', sex: '女', phone: '13715201314', height: '180', weight: '140' },
          { id: 3, name: '王五', age: '18', sex: '男', phone: '13715201314', height: '180', weight: '140' },
          { id: 4, name: '赵六', age: '18', sex: '男', phone: '13715201314', height: '180', weight: '140' }
        ]
      }
    }
  }
  `
export default {
  name: 'Drag',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      htmlCode1,
      htmlCode2,
      htmlCode3,
      htmlCode4,
      jsCode,
      jsCode1,
      loading: false,
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
      columns1: [
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
      columns3: [
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
        { id: 1, name: '张三', sex: '男', phone: '13715201314' },
        { id: 2, name: '李四', sex: '女', phone: '13715201314' },
        { id: 3, name: '王五', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
      ],
      columns2: [
        {
          show: true,
          type: 'selection',
          fixed: 'left',
          width: 40
        },
        {
          show: true,
          type: 'index',
          fixed: 'left',
          width: 40
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          width: 200
        },
        {
          show: true,
          prop: 'id',
          title: 'ID',
          width: 100
        },
        {
          show: true,
          prop: 'sex',
          title: '性别',
          width: 200
        },
        {
          show: true,
          prop: 'age',
          title: '年龄',
          width: 200
        },
        {
          show: true,
          prop: 'phone',
          title: '手机',
          width: 200
        },
        {
          show: true,
          prop: 'column1',
          title: '列1',
          width: 200
        },
        {
          show: true,
          prop: 'column2',
          title: '列2',
          width: 200
        },
        {
          show: true,
          prop: 'column3',
          title: '列3',
          width: 200
        },
        {
          show: true,
          prop: 'column4',
          title: '列4',
          width: 200
        },
        {
          show: true,
          prop: 'column5',
          title: '列5',
          width: 200
        },
        {
          show: true,
          prop: 'column6',
          title: '列6',
          width: 200
        },
        {
          show: true,
          prop: 'column7',
          title: '列7',
          width: 200
        },
        {
          show: true,
          prop: 'height',
          title: '身高',
          fixed: 'right',
          width: 100
        }
      ],
      data1: [
        { id: 1, name: '张三', age: '18', sex: '男', phone: '13715201314', height: '180', weight: '140' },
        { id: 2, name: '李四', age: '18', sex: '女', phone: '13715201314', height: '180', weight: '140' },
        { id: 3, name: '王五', age: '18', sex: '男', phone: '13715201314', height: '180', weight: '140' },
        { id: 4, name: '赵六', age: '18', sex: '男', phone: '13715201314', height: '180', weight: '140' }
      ]
    }
  }
}
</script>
