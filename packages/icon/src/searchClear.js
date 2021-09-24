export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-clear-search', data.class, data.staticClass]
    return h('span', data, [
      h('span', { class: 'eff-icon-clear-search-container' }, [
        h('span', { class: 'eff-icon-clear-search--top' }),
        h('span', { class: 'eff-icon-clear-search--center' }),
        h('span', { class: 'eff-icon-clear-search--bottom' })
      ])
    ])
  }
}

