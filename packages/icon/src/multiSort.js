export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-multi-sort', data.class, data.staticClass]
    return h('span', data, [
      h('span', { class: 'eff-icon-multi-sort--arrow' })
    ])
  }
}

