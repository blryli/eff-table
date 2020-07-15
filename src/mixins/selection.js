const checkeds = new Set()

export default {
  data() {
    return {
      selecteds: [],
      selectionAll: false,
      indeterminate: false
    }
  },
  created() {
    this.$on('row.selection.change', this.rowSelectionChange)
    this.$on('all.selection.change', this.allselectionChange)
  },
  beforeDestroy() {
    this.$off('row.selection.change', this.rowSelectionChange)
    this.$off('all.selection.change', this.allselectionChange)
  },
  watch: {
    selecteds(val) {
      this.$emit('selection-change', val.map(v => this.data[v]))
      const selectedsLength = this.selecteds.length
      const dataLength = this.data.length
      this.selectionAll = selectedsLength === dataLength
      this.indeterminate = Boolean(selectedsLength && selectedsLength < dataLength)
    }
  },
  methods: {
    clearSelection() {
      this.selecteds = []
    },
    toggleRowSelection(row, selected) {
      const rowIndex = this.data.findIndex(d => this.isSame(d, row))
      if (rowIndex !== -1) {
        this.toggleSelection(rowIndex, checkeds.has(rowIndex), selected)
      } else {
        console.error('methods toggleRowSelection (row) is not find')
      }
    },
    toggleAllSelection() {
      this.selectionAll = !this.selectionAll
      this.allselectionChange(this.selectionAll)
    },
    rowSelectionChange(index, selected) {
      this.toggleSelection(index, !selected)
      this.$emit('select', this.selecteds, this.data[index])
      this.$emit('selection-change', this.selecteds)
    },
    allselectionChange(selected) {
      this.selectionAll = selected
      this.indeterminate = false
      selected ? this.data.forEach((d, i) => checkeds.add(i)) : checkeds.clear()
      this.updateSelected()
      this.$emit('select-all', this.selecteds)
      this.$emit('selection-change', this.selecteds)
    },
    isSame(obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2)
    },
    toggleSelection(index, has, selected) {
      selected ? checkeds.add(index) : has ? checkeds.delete(index) : checkeds.add(index)
      this.updateSelected()
    },
    updateSelected() {
      this.selecteds = [...checkeds]
    },
    isChecked(index) {
      return this.selecteds.includes(index)
    }
  }
}
