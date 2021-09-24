
export default {
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-eye', data.class, data.staticClass]
    return h('span', data, [
      h('span', { class: 'eff-icon-eye__box' }, [
        h('span', { class: 'eff-icon-eye__top' }),
        h('span', { class: 'eff-icon-eye__bottom' })
      ])
    ])
  }
}

