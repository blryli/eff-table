export default {
  name: 'ColumnBatchCtrl',
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = ['eff-icon-batch-control', data.class, data.staticClass]
    return h('span', data, [
      h('span'),
      h('span')
    ])
  }
}
