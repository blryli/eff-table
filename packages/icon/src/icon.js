import Fixed from './fixed'
import SearchClear from './searchClear'
import RowDrag from './rowDrag'
import ColumnBatchCtrl from './columnBatchCtrl'
import ColumnCtrl from './columnCtrl'
import Subtotal from './subtotal'
import Eye from './eye'
import Deleted from './deleted'
export default {
  name: 'Icon',
  components: { Fixed, SearchClear, RowDrag, ColumnBatchCtrl, Eye },
  props: {
    icon: { type: String, default: 'like' }
  },
  render(h) {
    const { icon } = this
    const icons = {
      'fixed': <Fixed />,
      'SearchClear': <SearchClear />,
      'row-drag': <RowDrag />,
      'column-ctrl': <ColumnCtrl />,
      'column-batch-ctrl': <ColumnBatchCtrl />,
      'subtotal': <Subtotal />,
      'eye': <Eye />,
      'delete': <Deleted />
    }
    if (icons[icon]) {
      return icons[icon]
    }
    return <i class={'eff-icon-' + (icon === 'like' ? 'search' : icon)} />
  }
}
