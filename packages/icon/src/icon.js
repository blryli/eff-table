import Fixed from './fixed'
import SearchClear from './searchClear'
import RowDrag from './rowDrag'
import ColumnBatchCtrl from './columnBatchCtrl'
import ColumnCtrl from './columnCtrl'
import Subtotal from './subtotal'
import Eye from './eye'
import Deleted from './deleted'
import Refresh from './refresh'
import Replace from './replace'
export default {
  name: 'Icon',
  functional: true,
  components: { Fixed, SearchClear, RowDrag, ColumnCtrl, ColumnBatchCtrl, Subtotal, Eye, Deleted, Refresh, Replace },
  props: {
    icon: { type: String, default: 'like' }
  },
  render(h, context) {
    const { props, data } = context
    const { icon } = props
    const icons = {
      'fixed': Fixed,
      'clear-search': SearchClear,
      'row-drag': RowDrag,
      'column-ctrl': ColumnCtrl,
      'column-batch-ctrl': ColumnBatchCtrl,
      'subtotal': Subtotal,
      'eye': Eye,
      'delete': Deleted,
      'refresh': Refresh,
      'replace': Replace
    }
    if (icons[icon]) {
      return h(icons[icon], data)
    }
    data.class = 'eff-icon-' + (icon === 'like' ? 'search' : icon)
    return h('i', data)
  }
}
