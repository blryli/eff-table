import Panel from './src/Panel'

Panel.install = (vue) => {
  vue.component(Panel.name, Panel)
}

export default Panel
