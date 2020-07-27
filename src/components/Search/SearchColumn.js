import Icon from './components/icon.vue'

export default {
  name: 'TableSearchColumn',
  components: {
    Icon
  },
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    popover: { type: Object, default: () => {} },
    config: { type: Array, default: () => [] }
  },
  data() {
    return {
      form: { value: '', type: '' }
    }
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
        <div ref='item' class='eff-table__search-item'>
          {
            operator ? <div class='eff-table__search-dropdown'
              on-mouseenter={this.handleMouseenter}
              on-mouseleave={this.handleMouseleave}
            >
              <icon icon={operatorValue} operator={this.config} />
            </div> : ''
          }
          {slot}
        </div>
      </div>
    )
  },
  methods: {
    handleMouseenter(e) {
      console.log('mouseenter', e.target)
      this.$emit('update:popover', { show: true, reference: e.target, prop: this.column.prop })
    },
    handleMouseleave() {
      this.$emit('update:popover', { show: false, reference: null })
    }
  }
}
