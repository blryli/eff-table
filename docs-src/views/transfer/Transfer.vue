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
    <h3>懒加载</h3>
    <p>
      配置 <span class="primary"> lazy </span>为<span class="primary"> true </span>及<span class="primary"> loadMethod </span>  加载方法来开启树形懒加载
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-transfer
          v-model="value1"
          :data="data1"
          lazy
          :load-method="loadMethod"
          :titles="['源列表', '目标列表']"
          :button-texts="['到目标列表', '到源列表']"
          width="100%"
        />
      </div>
    </section>
    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode1" />
          <CodeSnippet class="javascript" :code="jsCode1" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../../components/CodeSnippet.vue'
import Collapse from '../../components/Collapse.vue'

const htmlCode = `
  <eff-transfer
    v-model="value"
    :data="data"
    :default-checked-keys="[2, 8]"
    :default-expanded-keys="[ 1,2, 7,8]"
    width="600px"
  />
  `
const htmlCode1 = `
  <eff-transfer
    v-model="value1"
    :data="data1"
    lazy
    :load-method="loadMethod"
    :titles="['源列表', '目标列表']"
    :button-texts="['到目标列表', '到源列表']"
    width="100%"
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
            label: '选项' + num,
            disabled: i % 4 === 0,
            children
          }
          for (let j = 0; j <= 1; j++) {
            num += 1
            children.push({
              key: num,
              label: '选项' + num,
              disabled: i % 2 === 0,
              children: [{ key: num + 10000, label: num + 100 + '' }]
            })
          }
          data.push(obj)
        }
        return data
      }
      return {
        value: [1],
        data: generateData()
      }
    }
  }
  `
const jsCode1 = `
  export default {
    data() {
      const generateData1 = _ => {
        const data = []
        let num = 0
        for (let i = 1; i <= 20; i++) {
          num += 1
          const obj = {
            key: num,
            label: '选项' + num
          }
          data.push(obj)
        }
        return data
      }
      return {
        value: [1],
        data1: generateData1()
      }
    },
    methods: {
      loadMethod({ row, rowIndex }) {
        return new Promise(resolve => {
          setTimeout(() => {
            const childs = [
              { key: row.key + 1000, label: row.label + 'Test1' },
              { key: row.key + 1500, label: row.label + 'Test2' }
            ]
            resolve(childs)
          }, 1000)
        })
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
          label: `选项 ${num}`,
          disabled: i % 4 === 0,
          children
        }
        for (let j = 0; j <= 1; j++) {
          num += 1
          children.push({
            key: num,
            label: `选项 ${num}`,
            disabled: i % 2 === 0,
            children: [{ key: num + 10000, label: num + 100 + '' }]
          })
        }
        data.push(obj)
      }
      return data
    }
    const generateData1 = _ => {
      const data = []
      let num = 0
      for (let i = 1; i <= 20; i++) {
        num += 1
        const obj = {
          key: num,
          label: `选项 ${num}`
        }
        data.push(obj)
      }
      return data
    }
    return {
      htmlCode,
      htmlCode1,
      jsCode,
      jsCode1,
      value: [1],
      value1: [1],
      data: generateData(),
      data1: generateData1()
    }
  },
  methods: {
    loadMethod({ row }) {
      const id = (~~(Math.random() * (1 << 30))).toString(36)
      return new Promise(resolve => {
        setTimeout(() => {
          const childs = [
            { key: row.key + id + 'a', label: row.label + id + 'a' },
            { key: row.key + id + 'b', label: row.label + id + 'b' }
          ]
          resolve(childs)
        }, 1000)
      })
    }
  }
}
</script>
