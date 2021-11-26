import XEUtils from 'xe-utils'

export default {
  data() {
    return {
      selecteds: [],
      selectionAll: false,
      indeterminate: false,
      isCopyFunc: false
    }
  },
  created() {
    Object.assign(this, { checkedsSet: new Set() })
  },
  computed: {
    checkeds() {
      const { tableDataMap, selecteds } = this
      return selecteds.reduce((acc, id) => {
        const row = tableDataMap.get(id)
        return row ? acc.concat([row]) : acc
      }, [])
    }
  },
  watch: {
    selecteds() {
      const { checkeds, selecteds } = this
      this.updateSelecteds()
      this.$emit('selection-change', checkeds, selecteds)
    },
    tableData() {
      this.updateSelecteds()
      this.dataChange()
    }
  },
  methods: {
    updateSelecteds() {
      const { selecteds, tableSourceData } = this
      const selectedsLength = selecteds.length
      const tableDataLength = tableSourceData.length
      this.selectionAll = Boolean(selectedsLength) && selectedsLength === tableDataLength
      this.indeterminate = Boolean(selectedsLength && selectedsLength < tableDataLength)
    },
    copyFromChecked() {
      this.isCopyFunc = true
      document.execCommand('copy')
    },
    getCheckRows() {
      return XEUtils.clone(this.checkeds, true)
    },
    clearSelection() {
      this.checkedsSet.clear()
      this.selectionChange()
    },
    toggleRowSelection(row, selected) {
      const { tableDataMap, rowId, toggleSelection, checkedsSet } = this
      const id = row[rowId]
      if (tableDataMap.has(id)) {
        toggleSelection(row, checkedsSet.has(id), selected)
      } else {
        console.error('methods toggleRowSelection (row) is not find')
      }
    },
    toggleAllSelection() {
      this.selectionAll = !this.selectionAll
      this.allselectionChange(this.selectionAll)
    },
    rowSelectionChange(row, selected, isRadio = false) {
      const { checkeds, tableDataMap, rowId, toggleSelection, selectionChange } = this
      const id = row[rowId]
      if (isRadio) {
        this.checkedsSet.clear()
      }
      toggleSelection(row, !selected)
      this.$emit('select', checkeds, tableDataMap.get(id))
      selectionChange()
    },
    allselectionChange(selected) {
      const { tableDataMap, selectionChange } = this
      this.selectionAll = selected
      this.indeterminate = false
      selected ? this.checkedsSet = new Set([...tableDataMap.keys()]) : this.checkedsSet.clear()
      selectionChange()
      this.$emit('select-all', this.checkeds)
    },
    toggleSelection(row, has, selected) {
      const id = row[this.rowId]
      selected ? this.checkedsSet.add(id) : has ? this.checkedsSet.delete(id) : this.checkedsSet.add(id)

      this.selectionChange()
    },
    setCurrentRow(row) {
      const { tableDataMap, rowId, selectionChange } = this
      const id = row[rowId]
      this.checkedsSet.clear()
      if (tableDataMap.has(id)) {
        this.checkedsSet.add(id)
      }

      selectionChange()
    },
    selectionChange() {
      this.selecteds = [...this.checkedsSet]
      this.$forceUpdate()
    },
    isChecked(row) {
      const { selecteds, rowId } = this
      return selecteds.includes(row[rowId])
    }
  }
}
