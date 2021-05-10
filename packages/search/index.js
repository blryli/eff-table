import Search from './src/search'

Search.install = (vue) => {
  vue.component(Search.name, Search)
}

export default Search
