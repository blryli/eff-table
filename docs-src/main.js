import Vue from 'vue'
import App from './App.vue'
import router from './router'
import EffTable from '../'
import Element from 'element-ui'
import axios from 'axios'
import('../package.json').then(config => import(`../dist/${config.name}.css`))
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(EffTable, {request: axios})
Vue.use(Element, { size: 'small' })

// 模拟数据
let templateId = 3
const templateList = [
  { id: 1, type: 1, name: '模板1', value: { name: '张三' }},
  { id: 2, type: 1, name: '模板2', value: { name: '李四', sex: ['1'] }}
]
// 模拟接口
const api = {
  query: ({type}) => Promise.resolve(templateList.filter(d => d.type === type)),
  add: ({name, value, type}) => Promise.resolve(templateList.push({ type:type, id: templateId++, name, value })),
  delete: (row) => Promise.resolve(templateList.splice(templateList.findIndex(d => d.id === row.id), 1))
}

// 配置表单接口
EffTable.Table.props.formRequest.default = () => ({
  query: ({formRequestParams}) => api.query(formRequestParams),
  add: ({name, value, formRequestParams}) => api.add({name, value, type: formRequestParams.type}),
  delete: ({row, formRequestParams}) => api.delete(row)
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
