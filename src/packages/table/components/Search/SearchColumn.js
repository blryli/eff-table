import Icon from './components/Icon.vue'
import Popover from '../Popover/index.vue'
import Operator from './components/Operator.vue'
import Input from './components/Input.vue'
import RangeInput from './components/RangeInput.vue'
import { getType } from '../../utils/index'
import { h } from 'vue'

const isDate = val => getType(val) === 'Date'

export default {
  name: 'TableSearchColumn',
  components: {
    Icon, Popover, Operator, Input, RangeInput
  },
  props: {
    modelValue: { type: Object, default: () => {} },
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
  emits: ['update:form', 'change'],
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
  watch: {
    'table.form'(form) {
      const { search, prop } = this.column
      search && (form[prop] === undefined || form[prop] && form[prop] !== this.form.value) && this.formChange(form[prop])
    }
  },
  mounted() {
    this.init()

    const { operator } = this.column.search || {}
    this.$nextTick(() => {
      operator && (this.reference = this.$refs.dropdown)
    })
  },
  methods: {
    formChange(val) {
      console.log('form  cahnge')
      this.form.value = val
      this.change()
    },
    init() {
      if (!this.column.prop) return
      const value = this.table.form[this.column.prop]
      const { search: { operatorDefault } = {}} = this.column
      this.form.value = value || ''
      this.form.type = (this.modelValue || {}).operator || operatorDefault || 'like'
    },
    handleMouseenter() {
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
      console.log('change', { field: this.column.prop, operator, content, type })
      this.$emit('change', { field: this.column.prop, operator, content, type })
    }
  },
  render() {
    const { column, columnIndex, columnClass, width, table, form, operators, reference, updateForm, handleMouseenter, handleMouseleave, operatorChange } = this
    const { search, prop } = column
    const { operator, render, rangeRender } = search || {}
    const { type } = form
    let slot = ''
    let rangeSlot = ''
    if (search && search) {
      if (render && typeof render !== 'function') {
        console.error('search render必须是函数！')
      }
      if (rangeRender && typeof rangeRender !== 'function') {
        console.error('search rangeRender必须是函数！')
      }
      slot = render && render(h, { prop, column, columnIndex }) || type !== 'range' && h(Input, {
        modelValue: this.form.value,
        'onUpdate:modelValue': val => (this.form.value = val),
        onChange: updateForm
      }) || ''
      const range = rangeRender && rangeRender(h, { prop, column, columnIndex })
      rangeSlot = range || (operator ? h(RangeInput, {
        modelValue: this.form.value,
        column: column,
        'onUpdate:modelValue': val => (this.form.value = val),
        onChange: updateForm
      }) : '')
    }

    return (
      h('div',
        {
          class: columnClass,
          key: columnIndex,
          'data-colid': columnIndex,
          style: table.setColumnStyle(column, columnIndex, width)
        },
        h('div',
          {
            ref: 'item',
            class: 'eff-table__search-item'
          },
          [
            operator ? h('div',
              {
                ref: 'dropdown',
                class: 'eff-table__search-dropdown',
                onMouseenter: handleMouseenter,
                onMouseleave: handleMouseleave
              },
              [
                h(Icon, { icon: type, operator: operators }),
                h(Popover,
                  {
                    ref: 'popover',
                    placement: 'bottom',
                    reference,
                    enterable: true
                  },
                  {
                    default: () => h(Operator, {
                      data: operators,
                      type: type,
                      onChange: operatorChange
                    })
                  }
                )
              ]
            ) : '',
            slot ? h('div', { class: 'eff-table__search-element', hidden: type === 'range' }, slot) : '',
            rangeSlot ? h('div', { class: 'eff-table__search-element', hidden: type !== 'range' }, rangeSlot) : '',
            table.search && !search && h('div', { class: 'eff-table__search-empty' }) || ''
          ]
        )
      )
    )
  }
}
