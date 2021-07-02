import Fixed from './fixed'
import SearchClear from './searchClear'
import RowDrag from './rowDrag'
import ColumnBatchCtrl from './columnBatchCtrl'
import ColumnCtrl from './columnCtrl'
export default {
  name: 'Icon',
  components: { Fixed, SearchClear, RowDrag, ColumnBatchCtrl },
  props: {
    icon: { type: String, default: 'like' }
  },
  render(h) {
    const { icon } = this
    if (icon === 'fixed') {
      return <Fixed />
    } else if (icon === 'clear-search') {
      return <SearchClear />
    } else if (icon === 'row-drag') {
      return <RowDrag />
    } else if (icon === 'column-ctrl') {
      return <ColumnCtrl />
    } else if (icon === 'column-batch-ctrl') {
      return <ColumnBatchCtrl />
    }
    return <i class={'eff-icon-' + (icon === 'like' ? 'search' : icon)} />
  }
}
