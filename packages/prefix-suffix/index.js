import PrefixSuffix from './src/prefix-suffix'

PrefixSuffix.install = (vue) => {
  vue.component(PrefixSuffix.name, PrefixSuffix)
}

export default PrefixSuffix
