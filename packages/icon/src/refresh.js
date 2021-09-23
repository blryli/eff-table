export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = 'eff-icon-refresh' + `${data.class ? ' ' + data.class : ''}`
    return h('div', data, [
      h('span', { class: 'eff-icon-refresh-icon' }, [
        h('span', { class: 'eff-icon-refresh-blank' }),
        h('span', { class: 'eff-icon-refresh-round' })
      ]),
      h('span', { class: 'eff-icon-refresh-icon symmetry' }, [
        h('span', { class: 'eff-icon-refresh-blank' }),
        h('span', { class: 'eff-icon-refresh-round' })
      ])
    ])
  }
}
