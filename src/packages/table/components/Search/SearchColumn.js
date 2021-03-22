import Icon from './components/Icon.vue'
import Popover from '../Popover/index.vue'
import Operator from './components/Operator.vue'
import Input from './components/Input.vue'
import RangeInput from './components/RangeInput.vue'
import { getType } from 'utils'

const isDate = val => getType(val) === 'Date'

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
      const { titleClassName } = this.column
      let classes = `eff-table__column`
      titleClassName && (classes += ` ${titleClassName}`)
      return classes
    }
  },
  mounted() {
    this.init()
    this.unwatch && this.unwatch()

    const { operator } = this.column.search || {}
    this.$nextTick(() => {
      this.unwatch = this.$watch(`table.form.${this.column.prop}`, this.formChange)
      operator && (this.reference = this.$refs.dropdown)
    })
  },
  beforeDestroy() {
    this.unwatch()
  },
  methods: {
    formChange(val) {
      this.form.value = val
      this.change()
    },
    valueChange(val) {
      this.form.value = val
      this.updateForm()
    },
    init() {
      if (!this.column.prop) return
      const value = this.table.form[this.column.prop]
      const { search: { operatorDefault } = {}} = this.column
      this.form.value = value || ''
      this.form.type = this.value.operator || operatorDefault || 'like'
    },
    handleMouseenter(e) {
      this.$refs.popover.doShow()
    },
    handleMouseleave() {
      this.$refs.popover.doHide()
    },
    operatorChange(type) {
      const operatorDefault = this.column.search.operatorDefault
      if (type === 'like' && operatorDefault) type = operatorDefault
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
      const operator = this.form.type
      let content = this.form.value
      if (Array.isArray(content) && isDate(content[0])) {
        content = content.map(d => new Date(d).getTime())
      } else if (isDate(content)) {
        content = new Date(content).getTime()
      }
      const type = this.column.search.type || null
      this.$emit('change', { field: this.column.prop, operator, content, type })
    }
  },
  render(h) {
    const { column, columnIndex, columnClass, width, table, form, operators, reference, valueChange, handleMouseenter, handleMouseleave, operatorChange } = this
    const { search, prop } = column
    const { operator, render, rangeRender } = search || {}
    const { type, value } = form
    let slot = ''
    let rangeSlot = ''
    if (search && search) {
      if (render && typeof render !== 'function') {
        console.error('search render必须是函数！')
      }
      if (rangeRender && typeof rangeRender !== 'function') {
        console.error('search rangeRender必须是函数！')
      }
      slot = render && render(h, { prop, column, columnIndex }) || type !== 'range' && <Input value={value} on-input={val => (this.form.value = val)} on-change={valueChange}/> || ''
      const range = rangeRender && rangeRender(h, { prop, column, columnIndex })
      rangeSlot = range || (operator ? <RangeInput value={value} column={column} on-change={valueChange}/> : '')
    }

    return (
      <div
        class={columnClass}
        key={columnIndex}
        data-colid={columnIndex}
        style={table.setColumnStyle(column, columnIndex, width)}
      >
        <div ref='item' class='eff-table__search-item'>
          {
            operator ? <div ref='dropdown' class='eff-table__search-dropdown'
              on-mouseenter={handleMouseenter}
              on-mouseleave={handleMouseleave}
            >
              <Icon icon={type} operator={operators} />
              <Popover
                ref='popover'
                placement='bottom'
                reference={reference}
                enterable
              >
                <Operator data={operators} type={type} on-change={operatorChange} />
              </Popover>
            </div> : ''
          }
          {
            slot ? <div class='eff-table__search-element' hidden={type === 'range'}>{slot}</div> : ''
          }
          {
            rangeSlot ? <div class='eff-table__search-element' hidden={type !== 'range'}>{rangeSlot}</div> : ''
          }
          {
            table.search && !search && <div class='eff-table__search-empty' /> || ''
          }
        </div>
      </div>
    )
  }
}
