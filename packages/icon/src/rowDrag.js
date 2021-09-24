
export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-drag', data.class, data.staticClass]
    return h('span', data, [
      h('span', { class: 'eff-icon-drag__stub' })
    ])
  }
}
