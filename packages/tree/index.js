import Tree from './src/tree'

Tree.install = (vue) => {
  vue.component(Tree.name, Tree)
}

export default Tree
