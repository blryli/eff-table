export default {
  name: 'ColumnBatchCtrl',
  functional: true,
  render(h, context) {
    const { data } = context
    data.class = 'eff-icon-batch-control' + `${data.class ? ' ' + data.class : ''}`
    const child = [1, 1, 1, 1, 1, 1, 1, 1, 1].map((d, i) => h('span', { key: i, class: 'eff-icon-batch-control__point' }))
    return h('span', data, child)
  }
}

