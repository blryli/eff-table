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
  data() {
    return {
    }
  },
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
    $el._onscroll = null
    $el.onscroll = null
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
      if (!(row.children && row.children.length && this.table.columnGroupIds.indexOf(row[this.table.rowId]) !== -1)) {
        return { groupNodes: [], index: rowIndex }
      }

      const { table, fixed, bodyColumns, formatValidators } = this
      const { renderColumn, rowId } = table
      const groupNodes = []

      const groupFloor = 1

      const func = (arr, groupFloor) => {
        arr.forEach((v, k) => {
          const dom = <TableBodyRow
            key={'group-' + groupFloor + rowIndex}
            row={v}
            group-floor={groupFloor}
            row-index={rowIndex}
            body-columns={fixed ? bodyColumns : renderColumn}
            fixed={fixed}
            messages={formatValidators[v[rowId]]}
          />
          ++rowIndex

          groupNodes.push(dom)

          if (!(v.children && v.children.length && this.table.columnGroupIds.indexOf(v[this.table.rowId]) !== -1)) {
            return
          }

          func(v.children, groupFloor + 1)
        })
      }

      func(row.children, groupFloor)

      return { groupNodes, index: rowIndex }
    }
  },
  render(h) {
    const { table, data, bodyStyle, xSpaceWidth, totalHeight, emptyStyle, fixed, bodyColumns, formatValidators } = this
    const { renderData, heights: { bodyHeight }, emptyText, renderColumn, renderIndex, expands, rowId } = table
    const { $scopedSlots, $slots, scopedSlots } = table
    const { expand } = scopedSlots || $scopedSlots || $slots

    let rowIndex = renderIndex

    return (
      <div class='eff-table__body-wrapper' style={{ height: bodyHeight + 'px' }}>
        <div class='eff-table__body--x-space' style={{ width: xSpaceWidth + 'px' }} />
        <div class='eff-table__body--y-space' style={{ height: totalHeight + 'px' }} />
        <div
          class='eff-table__body '
          style={bodyStyle}
        >
          {
            renderData.map((row, key) => {
              const { expanded } = expands.find(d => d.rowId === row[rowId]) || {}
              const classes = `eff-table__expanded expandid-${row[rowId]}`
              const expandNode = expanded ? <div class={classes}>{expand({ row, key })}</div> : ''

              const dom = [<TableBodyRow
                key={key}
                row={row}
                row-index={rowIndex}
                body-columns={fixed ? bodyColumns : renderColumn}
                fixed={fixed}
                vue={this}
                messages={formatValidators[row[rowId]]}
              />, expandNode]
              ++rowIndex

              const { groupNodes, index } = this.getGroupNode(row, rowIndex)
              rowIndex = index
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
