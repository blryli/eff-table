import SearchColumn from './SearchColumn'

export default {
  name: 'TableSearch',
  components: {
    SearchColumn
  },
  props: {
    value: { type: Array, default: () => [] },
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
  watch: {
    value(val) {
      this.searchData = val
    }
  },
  created() {
    this.searchData = this.value
  },
  methods: {
    change(val) {
      const { prop } = val
      const { searchData } = this
      const index = searchData.findIndex(d => d.prop === prop)
      index > -1 ? searchData.splice(index, 1, val) : searchData.push(val)

      // console.log('handleSearchChange', JSON.stringify(searchData, null, 2))
      this.$emit('input', searchData)
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
  render(h) {
    const { table, columns, searchData, operators, change, showSpace } = this
    const height = table.baseHeight + 'px'
    return <div class='eff-table__search' style={{ height, '--rowHeight': height }}>
      {
        columns.map((column, columnIndex) => {
          const { prop: searchProp } = column.search || {}
          const prop = searchProp || column.prop
          return <SearchColumn
            value={searchData.find(d => d.prop === prop) || { value: '', type: '' }}
            prop={prop}
            column={column}
            column-index={columnIndex}
            operators={operators}
            on-change={change}
          />
        })
      }
      {
        showSpace ? <div class='eff-table__column is--space' /> : ''
      }
    </div>
  }
}
