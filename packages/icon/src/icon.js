import Fixed from './fixed'
export default {
  name: 'Icon',
  components: { Fixed },
  props: {
    icon: { type: String, default: 'like' }
  },
  render(h) {
    const { icon } = this
    if (icon === 'fixed') return <Fixed />
    return <i class={'eff-icon-' + (icon === 'like' ? 'search' : icon)} />
  }
}
