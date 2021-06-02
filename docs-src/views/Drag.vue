<template>
  <div class="page-home page">
    <h2>Drag 拖动</h2>
    <p class="hint">
      列拖动前置条件<br>
      <span class="primary">drag</span> 属性设置为
      <span class="primary"> true </span><br>
      <span class="primary">border</span> 属性设置为
      <span class="primary"> true </span>
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          drag
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
      <span class="primary">column-control</span> 属性设置为
      <span class="primary"> true </span>，点击功能图标 <ColumnCtrl /> 开启列控制功能(显示/隐藏)
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          drag
          column-control
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

    <h3>列批量控制</h3>
    <p>
      <span class="primary">column-batch-control</span> 属性设置为
      <span class="primary"> true </span>，点击功能图标 <ColumnBatchCtrl /> 开启列批量控制功能(显示/隐藏)
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          drag
          column-batch-control
          border
        />
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

    <h3>行拖动</h3>
    <p>
      <span class="primary">row-drag</span> 属性设置为
      <span class="primary"> true </span>，开启行拖动功能，通过拖动列图标&nbsp;<RowDrag />&nbsp;使用行拖动
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          drag
          row-drag
          border
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
import ColumnCtrl from 'pk/icon/src/columnCtrl'
import ColumnBatchCtrl from 'pk/icon/src/columnBatchCtrl'
import RowDrag from 'pk/icon/src/rowDrag'

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
    column-control
    border
  />
  `
const htmlCode2 = `
 <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    drag
    column-batch-control
    border
  />
  `
const htmlCode3 = `
 <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    drag
    row-drag
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
export default {
  name: 'Drag',
  components: {
    CodeSnippet,
    Collapse,
    ColumnCtrl,
    ColumnBatchCtrl,
    RowDrag
  },

  data() {
    return {
      htmlCode,
      htmlCode1,
      htmlCode2,
      htmlCode3,
      jsCode,
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
      data: [
        { id: 1, name: '张三', sex: '男', phone: '13715201314' },
        { id: 2, name: '李四', sex: '女', phone: '13715201314' },
        { id: 3, name: '王五', sex: '男', phone: '13715201314' },
        { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
      ]
    }
  }
}
</script>
