export default {
  data() {
    return {
      expands: [],
      expandSlot: null
    }
  },
  computed: {
    useExpand() {
      const { visibleColumns, $slots, expands } = this
      return Boolean(visibleColumns.find(d => d.type === 'expand') && $slots.expand || expands.length)
    }
  },
  mounted() {
    this.$nextTick(() => {
      const { $scopedSlots, $slots, scopedSlots } = this
      const { expand } = scopedSlots || $scopedSlots || $slots
      this.expandSlot = expand
    })
  },
  methods: {
    toggleRowExpand(row, checked) {
      const { rowId, expands } = this
      const id = row[rowId]
      const expand = expands.find(d => d.rowId === id)
      if (expand) {
        this.$set(expand, 'expanded', checked !== undefined ? checked : !expand['expanded'])
      } else {
        expands.push({ rowId: id, height: 0, expanded: true })
      }
      this.$nextTick(() => {
        // 设置 expand 高度
        const expand = expands.find(d => d.rowId === id)
        const expandNode = document.querySelector('.expandid-' + id)
        if (expand && expand.expanded && expandNode) {
          expand.height = expandNode.offsetHeight
        }
        this.$emit('expand-change', this.expands)
      })
    },
    getRowExpandRecords() {
      const { tableData, expands, rowId } = this
      return tableData.filter(d => expands.find(e => e.rowId === d[rowId]))
    },
    isRowExpand(row) {
      const { rowId } = this
      const expand = this.expands.find(d => d.rowId === row[rowId])
      return Boolean(expand && expand.expanded)
    },
    setRowExpand(rows, checked) {
      rows.forEach(row => {
        this.toggleRowExpand(row, checked)
      })
    },
    setAllRowExpand(checked) {
      this.setRowExpand(this.tableData, checked)
    },
    clearRowExpand() {
      this.expands = []
    }
  }
}
