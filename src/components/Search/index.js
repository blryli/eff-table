import SearchColumn from './SearchColumn'

export default {
  name: 'TableSearch',
  components: {
    SearchColumn
  },
  props: {
    value: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    styles: { type: Object, default: () => {} },
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
      const { field } = val
      const index = this.searchData.findIndex(d => d.field === field)
      index > -1 ? this.searchData.splice(index, 1, val) : this.searchData.push(val)

      // console.log('handleSearchChange', JSON.stringify(this.searchData, null, 2))
      this.$emit('input', this.searchData)
      this.$emit('change', this.searchData.filter(d => {
        const { content } = d
        if (Array.isArray(content)) {
          return Boolean(content.length)
        } else {
          return Boolean(content)
        }
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
    return <div class='eff-table__search' style={this.styles}>
      {
        this.columns.map((column, columnIndex) => {
          return <SearchColumn
            value={this.searchData.find(d => d.field === column.prop) || { value: '', type: '' }}
            column={column}
            column-index={columnIndex}
            operators={this.operators}
            on-change={this.change}
          />
        })
      }
      {
        this.showSpace ? <div class='eff-table__column is--space' /> : ''
      }
    </div>
  }
}
