export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = 'eff-icon--subtotal' + `${data.class ? ' ' + data.class : ''}`
    return h('span', data, [
      h('span', { class: 'eff-icon--subtotal-container' }, [
        h('span', { class: 'eff-icon--subtotal-plus' }),
        h('span', { class: 'eff-icon--subtotal-line' }),
        h('span', { class: 'eff-icon--subtotal-equal' })
      ])
    ])
  }
}
