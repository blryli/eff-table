import Icon from './components/Icon.vue'
import Popover from '../Popover/index.vue'
import Operator from './components/Operator.vue'
import Input from './components/Input.vue'
import RangeInput from './components/RangeInput.vue'
import XEUtils from 'xe-utils'

export default {
  name: 'TableSearchColumn',
  components: {
    Icon, Popover, Operator, Input, RangeInput
  },
  props: {
    value: { type: Object, default: () => {} },
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
  mounted() {
    this.init()
    this.unwatch && this.unwatch()

    const { operator } = this.column.search || {}
    this.$nextTick(() => {
      this.unwatch = this.$watch(`table.form.${this.column.prop}`, this.renderChange)
      operator && (this.reference = this.$refs.dropdown)
    })
  },
  beforeDestroy() {
    this.unwatch()
  },
  methods: {
    renderChange(val) {
      this.form.value = val
      this.change()
    },
    valueChange(val) {
      this.form.value = val
      this.updateForm()
      this.change()
    },
    init() {
      const value = this.table.form[this.column.prop]
      const { search: { operatorDefault } = {}} = this.column
      this.form.value = value || ''
      this.form.type = this.value.type || operatorDefault || 'like'
    },
    handleMouseenter(e) {
      this.$refs.popover.doShow()
    },
    handleMouseleave() {
      this.$refs.popover.doHide()
    },
    operatorChange(type) {
      if (this.form.type === type) return
      let isChange = false

      if (type === 'like' || this.form.type === 'range') {
        this.form.value = ''
        this.updateForm()
        isChange = true
      } else if (type === 'range') {
        this.form.value = []
        this.updateForm()
        isChange = true
      }
      this.form.type = !type && this.column.search.operatorDefault || type
      if (isChange || this.form.value) this.change()
      this.$refs.popover.doHide()
    },
    updateForm() {
      const form = { ...this.table.form }
      const { prop } = this.column
      form[prop] = this.form.value
      this.table.$emit('update:form', form)
    },
    change() {
      const operator = this.form.type.toUpperCase()
      let content = this.form.value
      if (Array.isArray(content) && XEUtils.isDate(content[0])) {
        content = content.map(d => new Date(d).getTime())
      } else if (XEUtils.isDate(content)) {
        content = new Date(content).getTime()
      }
      const type = this.column.search.type || null
      this.$emit('change', { field: this.column.prop, operator, content, type })
    }
  },
  render(h) {
    const { column, columnIndex } = this
    const { operator, render, rangeRender } = column.search || {}
    const { type } = this.form
    let slot = ''
    let rangeSlot = ''
    if (this.table.search && column.search) {
      if (render && typeof render !== 'function') {
        console.error('search render必须是函数！')
      }
      if (rangeRender && typeof rangeRender !== 'function') {
        console.error('search rangeRender必须是函数！')
      }
      slot = render && render(h, { column, columnIndex }) || type !== 'range' && <Input value={this.form.value} on-change={this.valueChange}/> || ''
      rangeSlot = rangeRender && rangeRender(h, { column, columnIndex }) || <RangeInput value={this.form.value} column={column} on-change={this.valueChange}/> || ''
    }

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
            slot ? <div class='eff-table__search-element' hidden={this.form.type === 'range'}>{slot}</div> : ''
          }
          {
            rangeSlot ? <div class='eff-table__search-element' hidden={this.form.type !== 'range'}>{rangeSlot}</div> : ''
          }
          {
            this.table.search && !column.search && <div class='eff-table__search-empty' /> || ''
          }
        </div>
      </div>
    )
  }
}
