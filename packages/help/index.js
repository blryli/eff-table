import Help from './src/help'

Help.install = (vue) => {
  vue.component(Help.name, Help)
}

export default Help
