export default {
  functional: true,
  render(h, context) {
    const { props } = context
    const { list, transferDataStore, isChecked, isDisabled, isIndeterminate, rowSelectionChange } = props
    const { key, children } = props.props
    const renderNode = (list, tier = -1) => {
      tier++
      return list.map(row => {
        const id = row[key]
        const childs = row[children] || []
        const store = transferDataStore[id]
        return [
          h('div', { key: id, class: 'eff-transfer-panel-node', style: { marginLeft: 18 * tier + 'px' }}, [
            h('icon', {
              props: { icon: store.expanded ? 'caret-bottom' : 'caret-right' },
              on: { click: () => (store.expanded = !store.expanded) }
            }),
            h('v-checkbox', {
              props: { value: isChecked(id), label: row.label, disabled: isDisabled(row), indeterminate: isIndeterminate(id) },
              on: { change: selected => rowSelectionChange(row, selected) }
            })
          ]),
          store.expanded && childs.length ? renderNode(childs, tier) : ''
        ]
      })
    }
    return renderNode(list)
  }
}
