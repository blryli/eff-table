import Icon from './components/icon.vue'
const operatorConfig = [
  {
    type: 'equals',
    label: '等于',
    icon: '='
  },
  {
    type: 'unequals',
    label: '不等于',
    icon: '='
  },
  {
    type: 'less',
    label: '小于',
    icon: '<'
  },
  {
    type: 'greater',
    label: '大于',
    icon: '>'
  },
  {
    type: 'lessthan',
    label: '小于等于',
    icon: '<'
  },
  {
    type: 'greaterthan',
    label: '大于等于',
    icon: '>'
  },
  {
    type: 'range',
    label: '之间',
    icon: '~'
  },
  {
    type: 'like',
    label: '重置'
  }
]
export default {
  name: 'TableSearchColumn',
  components: {
    Icon
  },
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 }
  },
  inject: ['table'],
  computed: {
    width() {
      let { width = 0 } = this.column
      !width && (width = this.table.spaceWidth)
      const columnWidth = Math.max(width, 40)
      return columnWidth
    },
    columnClass() {
      const { fixed, titleClassName } = this.column
      let classes = `eff-table__column`
      if (fixed) {
        if (this.table.bodyOverflowX || fixed === 'right') classes += ' is--fixed'
      }
      titleClassName && (classes += ` ${titleClassName}`)
      return classes
    }
  },
  render(h) {
    const { column, columnIndex } = this
    const { render, operator, operatorValue = 'like' } = column.search || {}
    if (render && typeof render !== 'function') {
      console.error('search render必须是函数！')
    }
    const slot = render && render(h, { column, columnIndex }) || ''

    return (
      <div
        class={this.columnClass}
        data-colid={this.columnIndex}
        style={this.table.setColumnStyle(column, columnIndex, this.width)}
      >
        <div class='eff-table__search-item'>
          {
            operator ? <div class='eff-table__search-dropdown'
              on-mouseenter={this.handleMouseenter}
              on-mouseenter={this.handleMouseleave}
            >
              <icon icon={operatorValue} operator={operatorConfig} />
            </div> : ''
          }
          {slot}
        </div>
      </div>
    )
  },
  methods: {
    handleMouseenter() {},
    handleMouseleave() {}
  }
}
