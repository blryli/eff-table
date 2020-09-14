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
      const { field, content } = val
      const index = this.searchData.findIndex(d => d.field === field)
      if (Array.isArray(content) && content.length || !Array.isArray(content) && content) {
        index > -1 ? this.searchData.splice(index, 1, val) : this.searchData.push(val)
      } else {
        index > -1 && this.searchData.splice(index, 1)
      }

      // console.log('handleSearchChange', JSON.stringify(this.searchData, null, 2))
      this.$emit('input', this.searchData)
      this.$emit('change', this.searchData)
    },
    handleShow(val) {
      this.table.$emit('rangeShow', val)
    },
    handleClose(val) {
      this.table.$emit('rangeClose', val)
    }
  },
  render(h) {
    // <Range ref="tableRange" :range="tableSearchRange" @show="handleShow" @close="handleClose" />

    return <div class='eff-table__search' style={this.styles}>
      {
        this.columns.map((column, columnIndex) => {
          return <SearchColumn
            key={columnIndex}
            value={this.searchData.find(d => d.prop === column.prop) || { value: '', type: '' }}
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
