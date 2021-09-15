export default {
  name: 'Delete',
  functional: true,
  render(h) {
    return h('span', { class: 'eff-icon-delete' }, [
      h('span', { class: 'eff-icon-delete-top' }),
      h('span', { class: 'eff-icon-delete-bottom' })
    ])
  }
}
