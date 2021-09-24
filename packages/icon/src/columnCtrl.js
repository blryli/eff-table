export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-column-ctrl', data.class, data.staticClass]
    return h('span', data, [
      h('span', { class: 'eff-icon-column-ctrl__front' }),
      h('span', { class: 'eff-icon-column-ctrl__end' })
    ])
  }
}

