import Icon from './components/Icon.vue'
import Popover from '../Popover/index.vue'
import Operator from './components/Operator.vue'

export default {
  name: 'TableSearchColumn',
  components: {
    Icon, Popover, Operator
  },
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    operators: { type: Array, default: () => [] }
  },
  data() {
    return {
      form: { value: '', type: '' },
      show: false,
      reference: null
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
  created() {
    console.log('created')
  },
  mounted() {
    this.unwatch && this.unwatch()
    const value = this.table.form[this.column.prop]
    const { search: { operatorDefalut } = {}} = this.column
    this.form.value = value || ''
    this.form.type = operatorDefalut || 'like'

    const { operator } = this.column.search || {}
    this.$nextTick(() => {
      this.unwatch = this.$watch(`table.form.${this.column.prop}`, val => {
        this.form.value = val
        this.change()
      })
      operator && (this.reference = this.$refs.dropdown)
    })
  },
  beforeDestroy() {
    this.unwatch()
  },
  render(h) {
    console.log('render')
    const { column, columnIndex } = this
    const { operator, render, rangeRender } = column.search || {}
    const { type } = this.form
    if (render && typeof render !== 'function') {
      console.error('search render必须是函数！')
    }
    if (rangeRender && typeof rangeRender !== 'function') {
      console.error('search rangeRender必须是函数！')
    }
    const slot = render && render(h, { column, columnIndex }) || ''
    const rangeSlot = rangeRender && rangeRender(h, { column, columnIndex }) || ''

    return (
      <div
        class={this.columnClass}
        data-colid={this.columnIndex}
        style={this.table.setColumnStyle(column, columnIndex, this.width)}
      >
        <div ref='item' class='eff-table__search-item'>
          {
            operator ? <div ref='dropdown' class='eff-table__search-dropdown'
              on-mouseenter={this.handleMouseenter}
              on-mouseleave={this.handleMouseleave}
            >
              <Icon icon={type} operator={this.operators} />
              <Popover
                ref='popover'
                placement='bottom'
                reference={this.reference}
                enterable
              >
                <Operator data={this.operators} type={type} on-change={this.operatorChange} />
              </Popover>
            </div> : ''
          }
          {
            <div class='eff-table__search-element' hidden={this.form.type === 'range'}>{slot}</div>
          }
          {
            <div class='eff-table__search-element' hidden={this.form.type !== 'range'}>{rangeSlot}</div>
          }
        </div>
      </div>
    )
  },
  methods: {
    handleMouseenter(e) {
      this.$refs.popover.doShow()
    },
    handleMouseleave() {
      this.$refs.popover.doHide()
    },
    operatorChange(type) {
      if (this.form.type === type) return

      if (type === 'like' || this.form.type === 'range') {
        this.form.value = ''
        this.updateForm()
      } else if (type === 'range') {
        this.form.value = []
        this.updateForm()
      }
      this.form.type = type === 'like' && this.column.search.operatorDefalut || type
      this.$refs.popover.doHide()

      this.change()
    },
    updateForm() {
      const form = { ...this.table.form }
      const { prop } = this.column
      form[prop] = this.form.value
      this.table.$emit('update:form', form)
    },
    change() {
      this.$emit('change', { prop: this.column.prop, ...this.form })
    }
  }
}
