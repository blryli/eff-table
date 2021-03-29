import TableBodyRow from './TableBodyRow'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'TableBody',
  components: {
    TableBodyRow
  },
  inject: ['table'],
  props: {
    data: { type: Array, default: () => [] },
    bodyColumns: { type: Array, default: () => [] },
    validators: { type: Array, default: () => [] },
    messages: { type: Array, default: () => [] },
    fixed: { type: String, default: '' }
  },
  setup(props) {
    return {}
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
      return (this.validators.concat(this.messages) || []).reduce((acc, cur) => {
        const rowIndex = `${cur.rowIndex}`
        if (!acc[rowIndex]) acc[rowIndex] = []
        acc[rowIndex].push(cur)
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
  beforeUnmount() {
    const { $el } = this
    $el._onscroll = null
    $el.onscroll = null
  },
  activated() {
    this.scrollEvent()
  },
  methods: {
    scrollEvent() {
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
    }
  },
  render() {
    const { table, data, bodyStyle, xSpaceWidth, totalHeight, emptyStyle, fixed, bodyColumns, formatValidators } = this
    const { renderData, heights: { bodyHeight }, emptyText, renderColumn, renderIndex, expands } = table
    const { expand } = table.$slots
    return h('div', {
      class: 'eff-table__body-wrapper',
      style: { height: bodyHeight + 'px' }
    }, [
      h('div', {
        class: 'eff-table__body--x-space',
        style: { width: xSpaceWidth + 'px' }
      }),
      h('div', {
        class: 'eff-table__body--y-space',
        style: { height: totalHeight + 'px' }
      }),
      h('div', {
        class: 'eff-table__body',
        style: bodyStyle
      },
      [
        renderData.map((row, rowIndex) => {
          const { expanded } = expands.find(d => d.rowIndex === rowIndex) || {}
          const expandNode = expanded ? h('div', { class: 'eff-table__expanded' }, expand({ row, rowIndex })) : ''
          const currentIndex = rowIndex + renderIndex
          return [
            h(TableBodyRow, {
              key: currentIndex,
              row,
              rowIndex: currentIndex,
              bodyColumns: fixed ? bodyColumns : renderColumn,
              fixed,
              messages: formatValidators[currentIndex]
            }, expandNode),
            !data.length ? h('div', { class: 'eff-empty-text', style: emptyStyle }, emptyText) : ''
          ]
        })
      ])
    ])
  }
})
