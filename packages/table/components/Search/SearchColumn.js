import Icon from 'pk/icon'
import Popover from 'pk/popover'
import Operator from './components/Operator.vue'
import Input from './components/Input.vue'
import RangeInput from './components/RangeInput.vue'
import { getType } from 'pk/utils'
import { renderer } from 'pk/utils/render'
import XEUtils from 'xe-utils'

const isDate = val => getType(val) === 'Date'

export default {
  name: 'TableSearchColumn',
  components: {
    Icon, Popover, Operator, Input, RangeInput
  },
  props: {
    value: { type: Object, default: () => {} },
    prop: { type: String, default: '' },
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    operators: { type: Array, default: () => [] }
  },
  data() {
    return {
      form: { [this.prop]: '', type: '' },
      show: false,
      reference: null
    }
  },
  inject: ['table'],
  computed: {
    columnClass() {
      const { titleClassName } = this.column
      let classes = `eff-table__column`
      titleClassName && (classes += ` ${titleClassName}`)
      return classes
    },
    columnStyle() {
      const { table, column, columnIndex } = this
      const style = {}
      const columnWidth = table.getColumnWidth(column)
      style.minWidth = columnWidth + 'px'
      style.maxWidth = columnWidth + 'px'
      if (columnIndex === 0) {
        style.borderLeft = 0
      }

      return style
    }
  },
  mounted() {
    this.init()
    this.unwatch && this.unwatch()

    const { operator } = this.column.search || {}
    this.$nextTick(() => {
      this.unwatch = this.$watch(`table.tableForm.${this.prop}`, this.formChange)
      operator && (this.reference = this.$refs.dropdown)
    })
  },
  beforeDestroy() {
    this.unwatch()
  },
  methods: {
    formChange(val) {
      const { prop } = this
      this.$set(this.form, prop, val)
      this.change()
    },
    searchChange(val) {
      const { prop } = this
      this.$set(this.form, prop, val)
      this.updateForm()
    },
    updateForm() {
      const { table, form, prop } = this
      const { tableForm } = table
      this.$set(table.tableForm, prop, form[prop])
      table.$emit('update:form', tableForm)
    },
    change() {
      const { form, prop } = this
      const operator = form.type
      let content = this.form[prop]
      if (Array.isArray(content) && isDate(content[0])) {
        content = content.map(d => new Date(d).getTime())
      } else if (isDate(content)) {
        content = new Date(content).getTime()
      }
      const type = this.column.search.type || null
      this.$emit('change', { field: prop, operator, content, type })
    },
    init() {
      const { prop } = this
      if (!prop) return
      const value = this.table.tableForm[prop]
      const { search: { operatorDefault } = {}} = this.column
      this.form[prop] = value || ''
      this.form.type = this.value.operator || operatorDefault || 'like'
    },
    handleMouseenter(e) {
      this.$refs.popover.doShow()
    },
    handleMouseleave() {
      this.$refs.popover.doHide()
    },
    operatorChange(type) {
      const { prop, column } = this
      const operatorDefault = (column.search || {}).operatorDefault
      if (type === 'like' && operatorDefault) type = operatorDefault
      if (this.form.type === type) return
      let isChange = false

      if (type === 'like' || this.form.type === 'range') {
        this.form[prop] = ''
        this.updateForm()
        isChange = true
      } else if (type === 'range') {
        this.form[prop] = []
        this.updateForm()
        isChange = true
      }
      this.form.type = !type && column.search.operatorDefault || type
      if (isChange || this.form[prop]) this.change()
      this.$refs.popover.doHide()
    },
    searchRender(h) {
      const { column } = this
      const { search } = column
      if (search) {
        const { table, form, prop, columnIndex, searchChange } = this
        const { config } = column
        const { operator, rangeRender } = search || {}
        const value = form[prop]
        const { type } = form
        const { render } = search || {}
        let slot = null
        let rangeSlot = null
        if (typeof render === 'function') {
          slot = render(h, { prop, row: form, column, columnIndex })
        } else {
          const renderOpts = XEUtils.merge({}, config, render || {})
          const { name } = renderOpts
          const compConf = renderer.get(name)
          // name !== 'input' &&
          if (compConf && typeof compConf.renderSearch === 'function') {
            slot = compConf.renderSearch(h, renderOpts, { root: table, vue: this, data: form, column, columnIndex, prop, searchChange }) || ''
          } else {
            slot = <Input value={value} on-input={val => this.$set(this.form, prop, val)} on-change={searchChange}/>
          }
        }
        if (operator && type === 'range') {
          if (rangeRender === 'function') {
            rangeSlot = rangeRender(h, { prop, column, columnIndex })
          } else {
            const renderOpts = XEUtils.merge({}, config, render)
            const { name, type } = renderOpts
            const compConf = renderer.get(name || type)
            if (compConf && compConf.renderSearchRange) {
              rangeSlot = compConf.renderSearchRange(h, renderOpts, { root: table, vue: this, data: form, column, columnIndex, prop, searchChange }) || ''
            } else {
              rangeSlot = <RangeInput value={value} column={column} on-change={searchChange}/>
            }
          }
        }
        return { slot, rangeSlot }
      }
      return {}
    }
  },
  render(h) {
    const { column, columnIndex, columnClass, columnStyle, table, form, operators, reference, searchRender, handleMouseenter, handleMouseleave, operatorChange } = this
    const { search } = column
    const { operator } = search || {}
    const { type } = form
    const { slot, rangeSlot } = searchRender(h)

    return (
      <div
        class={columnClass}
        key={columnIndex}
        data-colid={columnIndex}
        style={columnStyle}
      >
        <div ref='item' class='eff-table__search-item'>
          {
            operator ? <div ref='dropdown' class='eff-table__search-dropdown'
              on-mouseenter={handleMouseenter}
              on-mouseleave={handleMouseleave}
            >
              <Icon icon={type} />
              <Popover
                ref='popover'
                placement='bottom'
                reference={reference}
                enterable
                isFixed
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
