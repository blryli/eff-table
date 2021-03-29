import VCheckbox from '../components/Checkbox/index.vue'
import { getTextWidth } from '../utils/dom'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'TableHeaderColumn',
  components: { VCheckbox },
  inject: ['table'],
  props: {
    column: { type: Object, default: () => {} },
    columnIndex: { type: Number, default: 0 },
    bodyColumnIndex: { type: Number, default: 0 },
    colid: { type: String, default: '' }
  },
  emits: ['sort-change'],
  computed: {
    columnClass() {
      const { titleClassName, drag, fixed, edit: { render: editRender } = {}} = this.column

      let classes = `eff-table__column`
      titleClassName && (classes += ` ${titleClassName}`)
      editRender && (classes += ` col-edit`)
      if (drag === false || fixed) {
        classes += ' is-drag--filter'
      }
      return classes
    }
  },
  methods: {
    sortActive(od) {
      const { table, column } = this
      const { prop, order } = table.curSort
      return prop === column.prop && order === od
    },
    renderSelection(h) {
      const { table, columnIndex, selectionChange } = this
      return h(VCheckbox,
        {
          modelValue: table.selectionAll,
          key: columnIndex,
          indeterminate: table.indeterminate,
          onChange: selectionChange
        }
      )
    },
    selectionChange(val) {
      this.table.allselectionChange(val)
    },
    titleRender(h, { column, columnIndex }) {
      if (column.titleRender) {
        if (typeof column.titleRender === 'function') {
          return column.titleRender(h, { title: column.title, column, columnIndex })
        } else {
          console.error('titleRender 必须是函数')
        }
      }
      return false
    },
    handleMouseenter() {
      const { table, column: { width }, $refs: { cell }} = this
      const { tipShow, spaceWidth } = table
      if (!cell.classList.contains('eff-cell') && cell.childNodes.length) {
        return
      }

      if (width && getTextWidth(cell) > Math.max(width, 40) || !width && getTextWidth(cell) > spaceWidth) {
        tipShow({ reference: cell.parentNode, message: [{ type: 'info', message: cell.innerText }] })
      }
    },
    handleMouseleave() {
      this.table.tipClose()
    },
    sortClick(order) {
      const { column, column: { prop }} = this
      this.$emit('sort-change', { column, prop, order })
    }
  },
  render() {
    const { table, column, columnIndex, columnClass, colid, bodyColumnIndex, titleRender, renderSelection, handleMouseenter, handleMouseleave, sortActive, sortClick } = this
    const { sortable, title, type, validator } = column

    const slot = type === 'expand' ? '' : column.titleRender ? titleRender(h, { column, columnIndex }) : type === 'selection' ? renderSelection(h) : type === 'index' ? (title || '#') : title
    const { required } = validator || {}

    return (
      h('div',
        {
          class: columnClass,
          'data-colid': colid,
          'data-colidx': columnIndex,
          key: colid,
          style: table.setColumnStyle(column, bodyColumnIndex),
          onMouseenter: event => handleMouseenter(event, slot),
          onMouseleave: event => handleMouseleave(event, slot)
        },

        h('div',
          { ref: 'cell', class: { 'eff-cell': true, sortable }},
          [
            required ? h('i', { class: 'eff-cell--required' }) : '',
            h('span', { class: 'eff-cell--title' }, slot),
            sortable ? h('span', { class: 'eff-cell--sort' },
              [
                h('i',
                  {
                    class: { 'eff-cell--sort-asc': true, 'is--active': sortActive('asc') },
                    onClick: () => sortClick('asc')
                  }
                ),
                h('i',
                  {
                    class: { 'eff-cell--sort-desc': true, 'is--active': sortActive('desc') },
                    onClick: () => sortClick('desc')
                  }
                )
              ]
            ) : ''
          ]
        )
      )
    )
  }
})
