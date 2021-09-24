export default {
  name: 'Delete',
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-delete', data.class, data.staticClass]
    return h('span', data, [
      h('span', { class: 'eff-icon-delete-top' }),
      h('span', { class: 'eff-icon-delete-bottom' })
    ])
  }
}
