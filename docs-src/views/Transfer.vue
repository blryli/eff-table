<template>
  <div class="page-home page">
    <h2>Transfer 穿梭框</h2>
    <p class="hint">
      基础属性<br>
      <span class="primary">value</span> 表格列数组<br>
      <span class="primary">data</span> 表格数据
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-transfer
          v-model="value"
          :data="data"
          :titles="['from', 'to']"
          :button-texts="['', '']"
          :default-checked-keys="[1, 2, 7]"
          :default-expanded-keys="[1, 2, 7]"
        >
          <!-- <template #leftFooter>
            <div>
              aaaaa
            </div>
          </template> -->
        </eff-transfer>
        <!-- {{ data }} -->
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
    <tree-transfer :from_data="fromData" :to_data="toData" :default-props="{label:'label'}" height="540px" filter open-all />
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'
import treeTransfer from 'el-tree-transfer'

const htmlCode = `
  <eff-table v-model="value" :data="data" /> 
  `

const jsCode = `
  export default {
    data() {
      return {
        value: [
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
  name: 'Transfer',
  components: {
    CodeSnippet,
    Collapse,
    treeTransfer
  },

  data() {
    const generateData = _ => {
      const data = []
      let num = 0
      for (let i = 1; i <= 500; i++) {
        num += 1
        const children = []
        const obj = {
          key: num,
          label: `备选项 ${num}`,
          disabled: i % 4 === 0,
          children
        }
        for (let j = 0; j <= 1; j++) {
          num += 1
          children.push({
            key: num,
            label: `备选项 ${num}`,
            disabled: i % 2 === 0,
            children: [{ key: num + 10000, label: num + 100 + '' }]
          })
        }
        data.push(obj)
      }
      return data
    }
    return {
      htmlCode,
      jsCode,
      value: [1],
      data: generateData(),
      fromData: [
        {
          id: '1',
          pid: 0,
          label: '一级 1',
          children: [
            {
              id: '1-1',
              pid: '1',
              label: '二级 1-1',
              // disabled: true,
              children: []
            },
            {
              id: '1-2',
              pid: '1',
              label: '二级 1-2',
              children: [
                {
                  id: '1-2-1',
                  pid: '1-2',
                  children: [],
                  label: '二级 1-2-1'
                },
                {
                  id: '1-2-2',
                  pid: '1-2',
                  children: [],
                  label: '二级 1-2-2'
                }
              ]
            },
            {
              id: '1-3',
              pid: '1',
              label: '二级 1-3',
              children: [
                {
                  id: '1-3-1',
                  pid: '1-3',
                  children: [],
                  label: '二级 1-3-1'
                },
                {
                  id: '1-3-2',
                  pid: '1-3',
                  children: [],
                  label: '二级 1-3-2'
                }
              ]
            }
          ]
        }
      ],
      toData: []
    }
  }
}
</script>
