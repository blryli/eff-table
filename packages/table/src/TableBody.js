import TableBodyRow from './TableBodyRow'
import XEUtils from 'xe-utils'

export default {
  name: 'TableBody',
  components: {
    TableBodyRow
  },
  props: {
    data: { type: Array, default: () => [] },
    bodyColumns: { type: Array, default: () => [] },
    validators: { type: Array, default: () => [] },
    messages: { type: Array, default: () => [] },
    fixed: { type: String, default: '' }
  },
  inject: ['table'],
  computed: {
    columns() {
      const { fixed, bodyColumns, table: { renderColumn }} = this
      return fixed ? bodyColumns : renderColumn
    },
    bodyStyle() {
      const { bodyMarginTop, bodyMarginLeft, bodyRenderWidth } = this.table
      const style = {}
      style.marginTop = bodyMarginTop
      if (!this.fixed) {
        style.marginLeft = bodyMarginLeft
        style.width = bodyRenderWidth + 'px'
      }
      return style
    },
    formatValidators() {
      return (this.validators.concat(this.messages) || []).reduce((acc, cur, index) => {
        const id = `${cur.id}`
        if (!acc[id]) acc[id] = []
        acc[id].push(cur)
        return acc
      }, {})
    },
    emptyStyle() {
      const { bodyWidth, _rowHeight } = this.table
      return {
        width: bodyWidth + 'px',
        height: _rowHeight + 'px'
      }
    },
    xSpaceWidth() {
      const { table: { widths: { leftWidth, rightWidth }, bodyWidth }, fixed } = this
      return fixed === 'left' ? leftWidth : fixed === 'right' ? rightWidth : bodyWidth
    },
    treeIndex() {
      return this.table.bodyColumns.findIndex(d => !['selection', 'radio', 'expand'].find(c => d.type === c))
    }
  },
  watch: {
    'table.scrollTop'(scrollTop) {
      const { $el, fixed, table } = this
      if (fixed === table.scrollType) return
      $el.scrollTop = scrollTop
      $el.onscroll = null
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        $el.onscroll = $el._onscroll
        clearTimeout(this.timer)
      }, 100)
    },
    'table.scrollLeft'(val) {
      const { fixed, $el } = this
      !fixed && ($el.scrollLeft = val)
    },
    'table.minWidth'(val) {
      const { bodyWrapperWidth, scrollYwidth } = this.table
      val <= bodyWrapperWidth - scrollYwidth && (this.$el.scrollLeft = 0)
    }
  },
  mounted() {
    const { table, $el, scrollEvent } = this
    table.bodyLoad = true
    $el.onscroll = scrollEvent
    $el._onscroll = scrollEvent
  },
  beforeDestroy() {
    const { $el } = this
    $el.onscroll = null
    $el._onscroll = null
  },
  activated() {
    // 缓存的页面，切回页面时，保持最后的滚动姿势
    const { scrollLeft = 0, scrollTop = 0 } = this.table
    this.table.scrollLeft = scrollLeft - 0.1
    this.table.scrollTop = scrollTop - 0.1
    this.table.scrollType = 'activated'
  },
  methods: {
    scrollEvent(e) {
      const { fixed, table } = this
      const { scrollLeft, scrollTop } = e.target
      if (!fixed) {
        table.scrollLeft = scrollLeft
      }
      if (table.scrollType !== fixed) {
        table.scrollType = fixed
      }
      if (table.scrollTop !== scrollTop) {
        table.scrollTop = scrollTop
      }
    },
    getTrees(row, rowIndex) {
      const { table, fixed, bodyColumns, formatValidators, treeIndex, renderExpand } = this
      const { renderColumn, rowId, treeIds, tableTreeConfig: { children }} = table
      if (!(row[children] && row[children].length && treeIds[row[rowId]])) {
        return []
      }

      const trees = []
      const treeFloor = 1

      const func = (arr, treeFloor, rowid) => {
        arr.forEach((d, i) => {
          const row_id = `${rowid ? rowid + '.' : ''}${i + 1}`

          const dom = [<TableBodyRow
            key={'tree-' + treeFloor + rowIndex + i}
            row={d}
            rowid={`${rowIndex + 1}.${row_id}`}
            treeFloor={treeFloor}
            treeIndex={treeIndex}
            row-index={rowIndex}
            body-columns={fixed ? bodyColumns : renderColumn}
            fixed={fixed}
            vue={this}
            messages={formatValidators[d[rowId]]}
          />, renderExpand ? renderExpand(d, rowIndex) : '']

          trees.push(dom)
          if (d[children] && d[children].length && treeIds[d[rowId]]) {
            func(d[children], treeFloor + 1, row_id)
          }
        })
      }

      func(row[children], treeFloor)

      return trees
    },
    renderExpand(row, rowIndex) {
      const { table, fixed, $createElement } = this
      const { bodyRenderWidth, edit, rowId, editStore, expands, expandSlot, widths: { leftWidth, rightWidth }} = table
      const { expanded, height } = expandSlot && expands.find(d => d.rowId === row[rowId]) || {}
      const classes = `eff-table__expanded expandid-${row[rowId]}`
      const style = { padding: '15px' }
      if (fixed) {
        style.width = bodyRenderWidth + 'px'
        style.height = height + 'px'
      } else {
        style.paddingLeft = leftWidth + 15 + 'px'
        style.paddingRight = (Math.max(rightWidth, 15)) + 'px'
      }
      const on = edit ? { mouseenter: () => (editStore.editRow = row) } : {}

      return expanded ? $createElement('div', { class: classes, style, on }, [expandSlot({ row, rowIndex })]) : ''
    }
  },
  render(h) {
    const { columns, table, bodyStyle, xSpaceWidth, emptyStyle, fixed, bodyColumns, formatValidators, treeIndex, renderExpand } = this
    const { renderData, heights: { dataHeight, bodyHeight }, emptyText, renderIndex, expands, rowId, subtotalData, expandSlot, _rowHeight, overflowX, overflowY, rowConfig, widths: { columnWidths }} = table
    let rows = (rowConfig || {}).rows || []
    if (!Array.isArray(rows)) rows = []
    let classes = 'eff-table__body-wrapper'
    if (overflowX) classes += ' is-overflow--x'
    if (overflowY) classes += ' is-overflow--y'
    return (
      <div class={classes} style={{ height: bodyHeight + 'px', '--rowHeight': _rowHeight + 'px' }}>
        <div class='eff-table__body--x-space' style={{ width: xSpaceWidth + 'px' }} />
        <div class='eff-table__body--y-space' style={{ height: dataHeight + 'px' }} />
        <div
          class='eff-table__body '
          style={bodyStyle}
        >
          {
            renderData.map((row, rowIndex) => {
              const currentIndex = rowIndex + renderIndex
              const rowid = `${currentIndex + 1}`
              const { expanded } = expandSlot && expands.find(d => d.rowId === row[rowId]) || {}

              const rowFun = (row, key = '') => {
                const uniqueId = XEUtils.uniqueId()
                if (key) {
                  return <TableBodyRow
                    key={currentIndex + key + uniqueId}
                    rowid={uniqueId}
                    row={row}
                    body-columns={columns}
                    fixed={fixed}
                    subtotal={true}
                  />
                }
                return [<TableBodyRow
                  key={currentIndex}
                  row={row}
                  rowid={rowid}
                  row-index={currentIndex}
                  treeIndex={treeIndex}
                  body-columns={columns}
                  fixed={fixed}
                  vue={this}
                  messages={formatValidators[row[rowId]]}
                />]
              }

              const renderRows = rowFun(row)
              // 展开行
              if (expanded) {
                renderRows.push(renderExpand(row, rowIndex))
              }
              // 树
              const trees = this.getTrees(row, currentIndex)
              if (trees.length) {
                renderRows.push(trees)
              }
              // 小计
              const subtotalFindRow = subtotalData.filter(s => s.index === rowIndex)
              if (subtotalFindRow.length) {
                const subtotalRow = rowFun(subtotalFindRow.reduce((acc, cur) => XEUtils.merge(acc, cur.row), {}), 'subtotal')
                renderRows.push(subtotalRow)
              }
              // 自定义行
              if (rows.length) {
                const customRows = rows.map(d => XEUtils.isFunction(d.row) ? <div class='eff-table__body-row--custom' style={{ height: d.height + 'px' }}>{d.row({ row, columns: bodyColumns, columnWidths })}</div> : '')
                renderRows.push(customRows)
              }
              return renderRows
            })
          }
          {
            !renderData.length ? <div class='eff-empty-text' style={emptyStyle}>{ emptyText }</div> : ''
          }
        </div>
      </div>
    )
  }
}
