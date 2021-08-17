import TableBodyRow from './TableBodyRow'

export default {
  name: 'TableFooter',
  components: {
    TableBodyRow
  },
  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    sumText: { type: String, default: '总计' },
    summaryMethod: { type: Function, default: null },
    fixed: { type: String, default: '' }
  },
  inject: ['table'],
  computed: {
    style() {
      const { rowHeight } = this.table
      return {
        minHeight: rowHeight + 'px',
        lineHeight: rowHeight + 'px'
      }
    },
    row() {
      const { columns, data, fixed } = this
      if (typeof this.summaryMethod === 'function') {
        return this.summaryMethod({ columns, data })
      }
      return columns.reduce((acc, column, index) => {
        if (index === 0 && fixed !== 'right') {
          acc[index] = this.sumText
          return acc
        }
        const { prop } = column
        const values = data.map(item => Number(item[prop]))
        const value = values.reduce((acc, cur) => !isNaN(Number(cur)) ? acc + cur : acc, 0)
        acc[index] = value
        return acc
      }, {})
    }
  },
  watch: {
    'table.scrollLeft'(val) {
      if (this.fixed) return
      this.$el.scrollLeft = val
    }
  },
  render(h) {
    const { row, columns, style, table, fixed } = this
    return (
      <div class='eff-table__footer' style={style}>
        <div class='eff-table__body--x-space' style={{ width: table.bodyWidth + 'px' }} />
        <div
          class='eff-table__body'
          style={ { marginLeft: fixed ? '' : table.bodyMarginLeft } }
        >
          <TableBodyRow
            row={row}
            row-index={1}
            body-columns={fixed ? columns : table.renderColumn}
            fixed={fixed}
            summary={true}
          />
        </div>
      </div>
    )
  }
}
