import CustomSearch from './src/customSearch.vue'

CustomSearch.install = (vue) => {
  vue.component(CustomSearch.name, CustomSearch)
}

export default CustomSearch