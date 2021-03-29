import { createRouter, createWebHistory } from 'vue-router'

const routerFiles = require.context('./views', true, /.vue$/)
const routerFileKeys = routerFiles.keys()

export const routes = routerFileKeys.reduce((acc, file) => {
  const component = routerFiles(file).default
  const fileName = file.replace(/\.\/|\.vue/g, '')
  const { name } = component
  return acc.concat({ path: `/${name}`, name: fileName, component })
}, [])
console.log(routes)
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes
})

export default router
