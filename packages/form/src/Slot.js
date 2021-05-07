export default {
  name: 'VSlot',
  props: {
    message: { type: [String, Object, Array], default: '' }
  },
  render(h) {
    return h('div', {}, [this.message])
  }
}
