import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routerFiles = require.context('@/views', true, /.vue$/)
const routerFileKeys = routerFiles.keys()

export const routes = routerFileKeys.reduce((acc, file) => {
  const component = routerFiles(file).default
  const fileName = file.replace(/\.\/|\.vue/g, '')
  const { name } = component
  return acc.concat({ path: `/${name}`, name: fileName, component })
}, [])

console.log('routes', JSON.stringify(routes.map(d => ({ path: d.path, name: d.name })), null, 2))

const router = new VueRouter({ routes })

export default router
