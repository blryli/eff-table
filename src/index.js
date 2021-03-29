import Table from './packages/table/index'

const components = [Table]

export {
  Table
}

const plugin = {
  install(app, opts = {}) {
    components.forEach(component => {
      app.component(component.name, component)
    })
  }
}

export default plugin
