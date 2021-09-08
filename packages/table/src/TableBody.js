import TableBodyRow from './TableBodyRow'

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
    bodyStyle() {
      const { bodyMarginTop, bodyMarginLeft, bodyRenderWidth, columnIsVirtual } = this.table
      const style = {}
      style.marginTop = bodyMarginTop
      if (!this.fixed) {
        style.marginLeft = bodyMarginLeft
        if (columnIsVirtual) {
          style.width = bodyRenderWidth + 'px'
        }
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
    totalHeight() {
      const { data, table } = this
      return data.length * table.rowHeight
    },
    emptyStyle() {
      const { bodyWidth, rowHeight } = this.table
      return {
        width: bodyWidth + 'px',
        height: rowHeight + 'px'
      }
    },
    xSpaceWidth() {
      const { table: { leftWidth, rightWidth, bodyWidth }, fixed } = this
      return fixed === 'left' ? leftWidth : fixed === 'right' ? rightWidth : bodyWidth
    }
  },
  watch: {
    'table.scrollTop'(scrollTop) {
      const { $el, fixed, table } = this
      $el.scrollTop = scrollTop
      if (fixed !== table.fixedType) {
        $el.onscroll = null
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          $el.onscroll = $el._onscroll
          clearTimeout(this.timer)
        }, 100)
      }
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
  },
  methods: {
    scrollEvent(e) {
      const { fixed, $el, table } = this
      const { body } = table.$refs
      const { scrollTop } = $el
      if (!fixed) {
        const { scrollLeft } = body.$el
        table.scrollLeft = scrollLeft
      }
      if (scrollTop === table.scrollTop) return
      table.fixedType = fixed
      table.scrollTop = scrollTop
    },
    getGroupNode(row, rowIndex) {
      const { table, fixed, bodyColumns, formatValidators } = this
      const { renderColumn, rowId, treeIds } = table
      const { children = 'children' } = table.treeConfig
      if (!(row[children] && row[children].length && treeIds[row[rowId]])) {
        return []
      }

      const groupNodes = []
      const groupFloor = 1

      const func = (arr, groupFloor, rowid) => {
        arr.forEach((d, i) => {
          const row_id = `${rowid ? rowid + '.' : ''}${i + 1}`

          const dom = <TableBodyRow
            key={'group-' + groupFloor + rowIndex + i}
            row={d}
            rowid={`${rowIndex + 1}.${row_id}`}
            group-floor={groupFloor}
            row-index={rowIndex}
            body-columns={fixed ? bodyColumns : renderColumn}
            fixed={fixed}
            vue={this}
            messages={formatValidators[d[rowId]]}
          />

          groupNodes.push(dom)
          if (d[children] && d[children].length && treeIds[d[rowId]]) {
            func(d[children], groupFloor + 1, row_id)
          }
        })
      }

      func(row[children], groupFloor)

      return groupNodes
    }
  },
  render(h) {
    const { table, data, bodyStyle, xSpaceWidth, totalHeight, emptyStyle, fixed, bodyColumns, formatValidators } = this
    const { renderData, heights: { bodyHeight }, emptyText, renderColumn, renderIndex, expands, rowId } = table
    const { $scopedSlots, $slots, scopedSlots } = table
    const { expand } = scopedSlots || $scopedSlots || $slots

    return (
      <div class='eff-table__body-wrapper' style={{ height: bodyHeight + 'px' }}>
        <div class='eff-table__body--x-space' style={{ width: xSpaceWidth + 'px' }} />
        <div class='eff-table__body--y-space' style={{ height: totalHeight + 'px' }} />
        <div
          class='eff-table__body '
          style={bodyStyle}
        >
          {
            renderData.map((row, rowIndex) => {
              const currentIndex = rowIndex + renderIndex
              const rowid = `${currentIndex + 1}`
              const { expanded } = expands.find(d => d.rowId === row[rowId]) || {}
              const classes = `eff-table__expanded expandid-${row[rowId]}`
              const expandNode = expanded ? <div class={classes}>{expand({ row, rowIndex })}</div> : ''

              const dom = [<TableBodyRow
                key={currentIndex}
                row={row}
                rowid={rowid}
                row-index={currentIndex}
                body-columns={fixed ? bodyColumns : renderColumn}
                fixed={fixed}
                vue={this}
                messages={formatValidators[row[rowId]]}
              />, expandNode]

              const groupNodes = this.getGroupNode(row, currentIndex)
              return dom.concat(groupNodes)
            })
          }
          {
            !data.length ? <div class='eff-empty-text' style={emptyStyle}>{ emptyText }</div> : ''
          }
        </div>
      </div>
    )
  }
}
