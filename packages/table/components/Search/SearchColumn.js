import Icon from './components/Icon.vue'
import Popover from '../../../popover'
import Operator from './components/Operator.vue'
import Input from './components/Input.vue'
import RangeInput from './components/RangeInput.vue'
import { getType } from 'packages/table/utils'
import { renderer } from 'core/render'

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
      form: { [this.column.prop]: '', type: '' },
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
      this.unwatch = this.$watch(`table.tableForm.${this.column.prop}`, this.formChange)
      operator && (this.reference = this.$refs.dropdown)
    })
  },
  beforeDestroy() {
    this.unwatch()
  },
  methods: {
    formChange(val) {
      console.log('form change')
      this.form[this.column.prop] = val
      this.change()
    },
    searchChange(val) {
      console.log('search change', val, this.column.prop, this.form)
      this.form[this.column.prop] = val
      this.updateForm()
    },
    updateForm() {
      const { table, form, column: { prop }} = this
      const { tableForm } = table
      this.$set(table.tableForm, prop, form[prop])
      table.$emit('update:form', tableForm)
    },
    change() {
      const { form, column } = this
      const operator = form.type
      const { prop } = column
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
      if (!this.column.prop) return
      const value = this.table.tableForm[this.column.prop]
      const { search: { operatorDefault } = {}} = this.column
      this.form[this.column.prop] = value || ''
      this.form.type = this.value.operator || operatorDefault || 'like'
    },
    handleMouseenter(e) {
      this.$refs.popover.doShow()
    },
    handleMouseleave() {
      this.$refs.popover.doHide()
    },
    operatorChange(type) {
      const { column } = this
      const { prop } = column
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
        const { table, form, columnIndex, searchChange } = this
        const { prop, config } = column
        const { operator, rangeRender } = search || {}
        const value = form[prop]
        const { type } = form
        const { render } = search || {}
        let slot = null
        let rangeSlot = null
        if (typeof render === 'function') {
          slot = render(h, { prop, column, columnIndex })
        } else {
          const renderOpts = Object.assign({}, config, render || {})
          const { name } = renderOpts
          const compConf = renderer.get(name)
          if (compConf && typeof compConf.renderSearch === 'function') {
            slot = compConf.renderSearch(h, renderOpts, { table, data: form, column, columnIndex, prop, searchChange }) || ''
          } else {
            slot = <Input value={value} on-input={val => (this.form[prop] = val)} on-change={searchChange}/>
          }
        }
        if (operator && type === 'range') {
          if (rangeRender === 'function') {
            rangeSlot = rangeRender(h, { prop, column, columnIndex })
          } else {
            const renderOpts = Object.assign({}, config, render)
            const { name, type } = renderOpts
            const compConf = renderer.get(name || type)
            if (compConf && compConf.renderSearchRange) {
              rangeSlot = compConf.renderSearchRange(h, renderOpts, { table, data: form, column, columnIndex, prop, searchChange }) || ''
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
    const { column, columnIndex, columnClass, width, table, form, operators, reference, searchRender, handleMouseenter, handleMouseleave, operatorChange } = this
    const { search } = column
    const { operator } = search || {}
    const { type } = form
    const { slot, rangeSlot } = searchRender(h)

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
