<script>
import Icon from 'pk/icon'
import VCheckbox from 'pk/checkbox'

export default {
  name: 'TreeNode',
  functional: true,
  render(h, context) {
    const { props, data } = context
    const { row, showCheckbox, checked, disabled, tier } = props
    const open = false
    data.class = ['eff-tree-node', data.class, data.staticClass]
    if (!data.style) data.style = {}
    data.style.marginLeft = 12 * tier + 'px'
    return h('div', data, [
      <Icon icon={open ? 'caret-bottom' : 'caret-right'} />,
      showCheckbox ? <VCheckbox value={checked} label={row.label} disabled={disabled} /> : ''
    ])
  }
}
</script>
