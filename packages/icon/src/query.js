
export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-query', data.class, data.staticClass]
    return h('span', data, [
      h('span', { class: 'eff-icon-query-round' }),
      h('span', { class: 'eff-icon-query-line' })
    ])
  }
}

