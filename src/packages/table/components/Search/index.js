import SearchColumn from './SearchColumn'
import { h } from 'vue'

export default {
  name: 'TableSearch',
  components: {
    SearchColumn
  },
  props: {
    modelValue: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    showSpace: Boolean
  },
  data() {
    return {
      tableSearchRange: {},
      searchData: [],
      operators: [
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
    }
  },
  inject: ['table'],
  provide() {
    return { tableSearch: this }
  },
  emits: ['update:modelValue', 'change'],
  watch: {
    modelValue(val) {
      console.log({ val })
      this.searchData = val
    }
  },
  mounted() {
    this.searchData = this.modelValue
  },
  methods: {
    change(val) {
      console.log({ val })
      const { field } = val
      const { searchData } = this
      console.log({ searchData })
      const index = searchData.findIndex(d => d.field === field)
      index > -1 ? searchData.splice(index, 1, val) : searchData.push(val)

      // console.log('handleSearchChange', JSON.stringify(searchData, null, 2))
      this.$emit('update:modelValue', searchData)
      this.$emit('change', searchData.filter(d => {
        const { content } = d
        return Boolean(Array.isArray(content) ? content.length : content)
      }))
    },
    handleShow(val) {
      this.table.$emit('rangeShow', val)
    },
    handleClose(val) {
      this.table.$emit('rangeClose', val)
    }
  },
  render() {
    const { table, columns, searchData, operators, change, showSpace } = this
    return h('div',
      {
        class: 'eff-table__search',
        style: { height: table.rowHeight + 'px' }
      },
      [
        columns.map((column, columnIndex) => {
          return h(SearchColumn,
            {
              modelValue: searchData.find(d => d.field === column.prop) || { value: '', type: '' },
              column: column,
              columnIndex: columnIndex,
              operators: operators,
              onChange: change
            }
          )
        }),
        showSpace ? h('div', { class: 'eff-table__column is--space' }) : ''
      ]

    )
  }
}
