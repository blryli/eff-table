
export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-replace', data.class, data.staticClass]
    return h('span', data, [
      h('span', { class: 'eff-icon-replace-icon' }, [
        h('span', { class: 'eff-icon-replace-round' }),
        h('span', { class: 'eff-icon-replace-range' })
      ]),
      h('span', { class: 'eff-icon-replace-icon symmetry' }, [
        h('span', { class: 'eff-icon-replace-round' }),
        h('span', { class: 'eff-icon-replace-range' })
      ])
    ])
  }
}
