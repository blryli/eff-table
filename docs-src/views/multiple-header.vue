<template>
  <div class="page-home page">
    <h2>MutilpleHeader 多级表头</h2>
    <p class="hint">
      通过 <span class="primary"> children </span> 属性配置多级表头
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table v-bind="tableOptions" />
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
  <eff-table v-bind="tableOptions" />
  `
const jsCode = `
  export default {
    data() {
      return {
        tableOptions: {
          maxHeight: 400,
          border: true,
          columns: [
            {
              prop: 'date',
              title: '登记日期'
            },
            {
              prop: 'base',
              title: '基本信息',
              children: [
                {
                  prop: 'name',
                  title: '姓名'
                },
                {
                  prop: 'injection',
                  title: '疫苗注射情况',
                  children: [
                    {
                      prop: 'one',
                      title: '第一针'
                    },
                    {
                      prop: 'tow',
                      title: '第二针'
                    },
                    {
                      prop: 'reinforce',
                      title: '加强针'
                    }
                  ]
                }
              ]
            }
          ],
          data: [
            { date: '2021-10-15', name: '赵四', one: '已注射', tow: '已注射', reinforce: '已注射' },
            { date: '2021-06-15', name: '王五', one: '已注射', tow: '已注射', reinforce: '未注射' },
            { date: '2021-05-15', name: '老六', one: '已注射', tow: '未注射', reinforce: '未注射' }
          ]
        }
      }
    }
  }
  `
export default {
  name: 'MutilpleHeader',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      tableOptions: {
        maxHeight: 400,
        border: true,
        columns: [
          {
            prop: 'date',
            title: '登记日期'
          },
          {
            prop: 'base',
            title: '基本信息',
            children: [
              {
                prop: 'name',
                title: '姓名'
              },
              {
                prop: 'injection',
                title: '疫苗注射情况',
                children: [
                  {
                    prop: 'one',
                    title: '第一针'
                  },
                  {
                    prop: 'tow',
                    title: '第二针'
                  },
                  {
                    prop: 'reinforce',
                    title: '加强针'
                  }
                ]
              }
            ]
          }
        ],
        data: [
          { date: '2021-10-15', name: '赵四', one: '已注射', tow: '已注射', reinforce: '已注射' },
          { date: '2021-06-15', name: '王五', one: '已注射', tow: '已注射', reinforce: '未注射' },
          { date: '2021-05-15', name: '老六', one: '已注射', tow: '未注射', reinforce: '未注射' }
        ]
      }
    }
  }
}
</script>
