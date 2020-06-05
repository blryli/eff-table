<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <v-table
          ref="table"
          v-model="columns"
          drag
          column-control
          fullscreen
          border
          :height="400"
          :data="data"
        />
        <!-- <p>columns {{ columns }}</p> -->
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
data () {
  return {
    msg: 'vue component'
  }
}
`

const componentSnippet = `
<v-component :msg="msg" />
`
export default {
  name: 'Search',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      mainSnippet,
      componentSnippet,
      radio: null,
      data: [],
      forData: [
        { prop: 'city', label: '标题5' },
        { prop: 'name', label: '标题6' },
        { prop: 'message', label: '标题7' }
      ],
      showOverflowTooltip: true,
      show: false,
      sorts: [],
      columns: [
        {
          show: true,
          type: 'index',
          label: '序号',
          width: 80
        },
        {
          show: true,
          prop: 'email',
          label: '邮箱',
          width: 100
        },
        {
          show: true,
          prop: 'city',
          label: '城市',
          width: 100
        },
        {
          show: true,
          prop: 'datetime',
          label: '时间',
          width: 100
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|100': [
          {
            'email': '@email',
            'city': '@city',
            'datetime': '@datetime',
            'index|+1': 1
          }
        ]
      }).array
      console.log(this.data)
    }, 50)
  },
  methods: {

  }
}
</script>

<style lang="scss">
.v-table .cell .el-radio__label{
  display: none;
}
.table-toobar__left{
  button{
    padding: 5px 10px;
    border: 1px solid #ddd;
    background-color: #fff;
    cursor: pointer;
    &:hover, &:focus{
      border-color: #ccc;
      background-color: #f5f5f5;
    }
    &:active{
      border-color: #aaa;
      background-color: #f5f5f5;
    }
  }
}
</style>
