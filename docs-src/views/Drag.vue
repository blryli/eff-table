<template>
  <div class="page-home page">
    <h2>Drag 拖动</h2>
    <p>
      <span class="primary">drag</span> 属性设置为
      <span class="primary"> true </span>，开启列拖动功能，
      <span class="primary">column-control</span> 属性设置为
      <span class="primary"> true </span>，点击功能图标<ColumnCtrl />开启列控制功能(显示/隐藏)
    </p>
    <!-- <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :loading="loading"
          :max-height="400"
          drag
          column-control
          row-drag
          border
          fullscreen
        />
      </div>
    </section> -->

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
import ColumnCtrl from 'pk/icon/src/columnCtrl'

const snippet = [
  `
  <eff-table v-model="columns" :data="data" /> 
  `,
  `
  export default {
    data() {
      return {
        data: [],
        columns: [
          {
            show: true,
            type: 'index',
            title: '序号',
            width: 80,
            fixed: 'left'
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
            title: '手机',
            width: 150
          }
        ]
      }
    }
  }
  `
]
export default {
  name: 'Drag',
  components: {
    CodeSnippet,
    Collapse,
    ColumnCtrl
  },

  data() {
    return {
      snippet,
      loading: false,
      columns: [
        {
          show: true,
          type: 'index',
          width: 80,
          fixed: 'left'
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
          title: '手机',
          width: 150
        }
      ],
      data: [
        { name: '张三', sex: '男', phone: '13715201314' },
        { name: '李四', sex: '男', phone: '13715201314' }
      ]
    }
  }
}
</script>
