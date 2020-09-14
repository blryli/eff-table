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
          :max-height="400"
          drag
          search
          fullscreen
          border
          @search-change="searchChange"
        />
        <!-- <p>searchData {{ searchData }}</p>
        <p>form {{ form }}</p> -->
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
      searchData: [],
      radio: null,
      form: {
        email: '',
        city: '',
        datetime: ''
      },
      options: [{
        value: '选项1',
        label: '1'
      }, {
        value: '选项2',
        label: '2'
      }],
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
          prop: 'index',
          title: '序号',
          fixed: 'left',
          width: 80
        },
        {
          show: true,
          prop: 'email',
          title: '邮箱',
          width: 300,
          search: {
            operator: true
          }
        },
        {
          show: true,
          prop: 'city',
          title: '城市城市城市城市',
          width: 300,
          sortable: true,
          search: {
            render: (h, { column, columnIndex }) => {
              const { prop } = column
              return <el-select
                value={this.form[prop]}
                on-input={val => (this.form[prop] = val)}
              >
                {
                  this.options.map(item => {
                    return <el-option
                      key={item.value}
                      title={item.title}
                      value={item.value}>
                    </el-option>
                  })
                }
              </el-select>
            }
          }
        },
        {
          show: true,
          prop: 'datetime',
          title: '时间',
          width: 300,
          search: {
            render: (h, { column, columnIndex }) => {
              const { prop } = column
              return <el-date-picker
                value={this.form[prop]}
                type='date'
                on-input={val => (this.form[prop] = val)}
              />
            },
            rangeRender: (h, { column, columnIndex }) => {
              const { prop } = column
              return <el-date-picker
                value={this.form[prop]}
                type='daterange'
                on-input={val => (this.form[prop] = val)}
              />
            },
            operator: true,
            operatorDefault: 'equals',
            type: 'dates'
          }
        },
        {
          show: true,
          title: '操作',
          width: 60,
          fixed: 'right'
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
    }, 50)
  },
  methods: {
    searchChange(val) {
      console.log(JSON.stringify(val, null, 2))
      this.searchData = val
    }
  }
}
</script>

<style lang="scss">
.eff-table .cell .el-radio__label{
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
