<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          drag
          edit
          :edit-stop="editStop"
          column-control
          fullscreen
          border
          :height="400"
          :data="data"
        />
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
  name: '',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      mainSnippet,
      componentSnippet,
      data: [],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      editStop: false,
      columns: [
        {
          show: true,
          type: 'index',
          label: '序号',
          width: 80,
          fixed: 'left'
        },
        {
          show: true,
          prop: 'message',
          label: '消息',
          width: 100
          // edit: {
          //   render: (h, { rowIndex }) => {
          //     return <el-select
          //       value={this.value}
          //       placeholder='请选择'
          //       automatic-dropdown
          //       on-visible-change={val => (this.editStop = val)}
          //       on-input={val => (this.value = val)}
          //     >
          //       {
          //         this.options.map(item => {
          //           return <el-option
          //             key={item.value}
          //             label={item.label}
          //             value={item.value}>
          //           </el-option>
          //         })
          //       }
          //     </el-select>
          //   }
          // }
        },
        {
          show: true,
          prop: 'name',
          label: '名字',
          width: 100
        },
        {
          show: true,
          prop: 'email',
          label: '邮箱',
          edit: {
            skip: true
          }
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
          width: 100,
          fixed: 'right'
        }
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.data = mock.mock({
        'array|500': [
          {
            'message': '@email',
            'name': '@cname',
            'email': '@email',
            'city': '@city',
            'datetime': '@datetime',
            'index|+1': 1
          }
        ]
      }).array
      console.log(this.data)
    }, 1000)
  },
  methods: {

  }
}
</script>
