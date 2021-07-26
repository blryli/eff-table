import VTable from './src/table'

VTable.install = (vue) => {
  vue.component(VTable.name, VTable)
}

export default VTable
