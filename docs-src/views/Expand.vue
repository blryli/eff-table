<template>
  <div class="page-home page">
    <h2>Description</h2>
    <section class="demo">
      <div class="section-content">
        <eff-table
          ref="table"
          v-model="columns"
          :data="data"
          :loading="loading"
          :max-height="400"
          border
          drag
          edit
          fullscreen
        >
          <template #expand="{row}">
            <el-form label-position="left" inline>
              <el-form-item label="名字">
                <span>{{ row.name }}</span>
              </el-form-item>
              <el-form-item label="城市">
                <span>{{ row.city }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ row.email }}</span>
              </el-form-item>
              <el-form-item label="手机">
                <span>{{ row.phone }}</span>
              </el-form-item>
              <el-form-item label="核酸检测日期">
                <span>{{ row.datetime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </eff-table>
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          通过设置 type="expand" 和 Scoped slot 可以开启展开行功能（展开行不能用于虚拟滚动）
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
data() {
  return {
    data: [],
    columns: [
      {
        show: true,
        type: 'expand',
        width: 40
      },
      {
        show: true,
        prop: 'index',
        title: '序号',
        width: 80,
        fixed: 'left'
      },
      {
        show: true,
        prop: 'name',
        title: '名字',
        width: 120
      },
      {
        show: true,
        prop: 'city',
        title: '城市',
        width: 140
      },
      {
        show: true,
        prop: 'email',
        title: '邮箱',
        width: 150
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
`

const componentSnippet = `
<eff-table
  ref="table"
  v-model="columns"
  :data="data"
  :loading="loading"
  border
  fullscreen
>
  <template #expand="{row}">
    <el-form label-position="left">
      <el-form-item label="名字">
        <span>{{ row.name }}</span>
      </el-form-item>
      <el-form-item label="城市">
        <span>{{ row.city }}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <span>{{ row.email }}</span>
      </el-form-item>
      <el-form-item label="手机">
        <span>{{ row.phone }}</span>
      </el-form-item>
      <el-form-item label="核酸检测日期">
        <span>{{ row.datetime }}</span>
      </el-form-item>
    </el-form>
  </template>
</eff-table>
`
export default {
  name: 'Expand',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      mainSnippet,
      componentSnippet,
      loading: false,
      data: [],
      columns: [
        {
          show: true,
          type: 'expand',
          width: 40
        },
        {
          show: true,
          prop: 'index',
          title: '序号',
          width: 80,
          fixed: 'left'
        },
        {
          show: true,
          prop: 'name',
          title: '名字',
          width: 120,
          edit: true
        },
        {
          show: true,
          prop: 'city',
          title: '城市',
          width: 140
        },
        {
          show: true,
          prop: 'email',
          title: '邮箱',
          width: 150
        },
        {
          show: true,
          prop: 'phone',
          title: '手机',
          width: 150
        }
      ]
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.data = mock.mock({
        'array|100': [
          {
            'id|+1': 1,
            'city': '@city',
            'name': '@name',
            'email': '@email',
            'datetime': '@datetime',
            'phone': '13888888888',
            'index|+1': 1
          }
        ]
      }).array
      this.loading = false
    }, 100)
  }
}
</script>
