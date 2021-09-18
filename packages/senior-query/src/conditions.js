export default {
  name: 'Conditions',
  functional: true,
  render(h, context) {
    const { props: { value }, listeners } = context
    const { remove } = listeners
    const getRender = list => {
      return list.reduce((acc, cur) => {
        const { row, code, children, conditionConnector } = cur
        const connector = conditionConnector ? h('span', { class: 'eff-view-list-connector' }, conditionConnector) : ''
        if (children) {
          return acc.concat(h('span', {}, [connector, '( ', getRender(children), ' )']))
        } else {
          return acc.concat([h('span', { class: 'eff-view-list-item' }, [
            connector, h('span', { class: 'eff-view-list-item--code' },
              [h('span', {}, code), h('span', { class: 'eff-view-list-item--close', on: { click: () => remove && remove(row) }})]
            )
          ])])
        }
      }, [])
    }
    return h('span', { class: 'eff-view-list' }, getRender(value))
  }

}
