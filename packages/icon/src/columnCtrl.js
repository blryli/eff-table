export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = 'eff-icon-column-ctrl' + `${data.class ? ' ' + data.class : ''}`
    return h('span', data, [
      h('div', { class: 'eff-icon-column-ctrl__front' }),
      h('div', { class: 'eff-icon-column-ctrl__end' })
    ])
  }
}

