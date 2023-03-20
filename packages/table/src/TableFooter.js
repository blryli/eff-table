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
      const { baseHeight } = this.table
      return {
        minHeight: baseHeight + 'px'
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
        acc[index] = value || ''
        return acc
      }, {})
    }
  },
  mounted() {
    this.$nextTick(() => {
      const { fixed, table, $el } = this
      if (fixed) return
      if (table.scrollList.footer) return
      table.scrollList.footer = $el
    })
  },
  render(h) {
    const { row, columns, style, table, fixed } = this
    const { overflowY, bodyWidth, bodyMarginLeft, renderColumn, baseHeight } = table
    let classes = 'eff-table__footer'
    if (overflowY) classes += ' is-overflow--y'
    return (
      <div class={classes} style={style}>
        <div class='eff-table__body--x-space' style={{ width: bodyWidth + 'px' }} />
        <div
          class='eff-table__body'
          style={ { marginLeft: fixed ? '' : bodyMarginLeft } }
        >
          <TableBodyRow
            row-height={baseHeight}
            row={row}
            row-index={1}
            body-columns={fixed ? columns : renderColumn}
            fixed={fixed}
            summary={true}
          />
        </div>
      </div>
    )
  }
}
