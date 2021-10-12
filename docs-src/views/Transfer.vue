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
          :titles="['列表1', '列表2']"
          :button-texts="['到右边', '到左边']"
          :left-default-checked="[2,3]"
          :right-default-checked="[1,5]"
        >
          <!-- <template #leftFooter>
            <div>
              aaaaa
            </div>
          </template> -->
        </eff-transfer>
        {{ data }}
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
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

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
    Collapse
  },

  data() {
    const generateData = _ => {
      const data = []
      let num = 0
      for (let i = 1; i <= 15; i++) {
        num += 1
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0,
          children: [
            {
              key: `${num}-${i}`,
              label: `备选项 ${num}-${i}`,
              disabled: i % 4 === 0
            }
          ]
        })
      }
      return data
    }
    return {
      htmlCode,
      jsCode,
      value: [],
      data: generateData()
    }
  }
}
</script>
