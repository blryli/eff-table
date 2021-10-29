<template>
  <div class="page-home page">
    <h2>Transfer 穿梭框 <router-link class="page-router" to="/TransferApi">查看api</router-link></h2>
    <p class="hint">
      支持<span class="primary"> 树形 </span>结构的穿梭框组件<br>
      使用了<span class="primary"> 虚拟滚动 </span>优化组件性能
      <!-- <span class="primary">value</span> 表格列数组<br>
      <span class="primary">data</span> 表格数据 -->
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-transfer
          v-model="value"
          :data="data"
          :default-checked-keys="[2, 8]"
          :default-expanded-keys="[ 1,2, 7,8]"
          width="600px"
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
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-transfer
    v-model="value"
    :data="data"
    :default-checked-keys="[2, 8]"
    :default-expanded-keys="[ 1,2, 7,8]"
    width="600px"
  />
  `

const jsCode = `
  export default {
    data() {
      const generateData = _ => {
        const data = []
        let num = 0
        for (let i = 1; i <= 20; i++) {
          num += 1
          const children = []
          const obj = {
            key: num,
            label: '备选项' + num,
            disabled: i % 4 === 0,
            children
          }
          for (let j = 0; j <= 1; j++) {
            num += 1
            children.push({
              key: num,
              label: '备选项' + num,
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
        data: generateData()
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
      for (let i = 1; i <= 20; i++) {
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
      data: generateData()
    }
  }
}
</script>
