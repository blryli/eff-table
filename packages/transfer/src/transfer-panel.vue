<template>
  <div class="eff-transfer-panel">
    <div class="eff-transfer-panel__header">
      <VCheckbox v-model="selectionAll" :label="title" :indeterminate="indeterminate" @change="allselectionChange" />
      <small>{{ selecteds.length + '/' +data.length }}</small>
    </div>
    <div class="eff-transfer-panel__body">
      <Tree />
      <div v-for="row in data" :key="'checkbox'+row[props.key]">
        <VCheckbox :value="isChecked(row)" :label="row.label" :disabled="isDisabled(row)" @change="selected => rowSelectionChange(row, selected)" />
      </div>
    </div>
    <div v-if="$slots.default" class="eff-transfer-panel__footer">
      <slot />
    </div>
  </div>
</template>

<script>
import VCheckbox from 'pk/checkbox'
import Tree from 'pk/tree'
import XEUtils from 'xe-utils'

export default {
  name: 'EffTransferPanel',
  components: { VCheckbox, Tree },
  props: {
    value: { type: Array, default: () => ([]) },
    data: { type: Array, default: () => ([]) },
    defaultCheck: { type: Array, default: () => ([]) },
    title: { type: String, default: '列表' },
    props: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      selecteds: [],
      selectionAll: false,
      indeterminate: false
    }
  },
  computed: {
    checkeds() {
      const { dataMap, selecteds } = this
      return selecteds.map(id => {
        const mapId = dataMap.get(id)
        if (!mapId) {
          console.warn(id + ' 不存在于tableData')
        }
        return mapId
      }).filter(d => d)
    },
    transferData() {
      const { data, props } = this
      return data.reduce((acc, cur) => cur[props.disabled] ? acc : acc.concat([cur]), [])
    }
  },
  watch: {
    selecteds(val, oldVal) {
      this.updateSelecteds()
      const changeKeys = val.length > oldVal.length ? val.filter(d => oldVal.indexOf(d) === -1) : oldVal.filter(d => val.indexOf(d) === -1)
      this.$emit('input', this.checkeds)
      this.$emit('change', val, changeKeys)
    },
    data() {
      this.setDataMap()
    }
  },
  created() {
    Object.assign(this, {
      dataMap: new Map(),
      checkedsSet: new Set()
    })
    this.setDataMap()
    this.init()
  },
  methods: {
    init() {
      const { defaultCheck } = this
      if (defaultCheck.length) {
        defaultCheck.forEach(d => {
          this.checkedsSet.add(d)
        })
        this.selectionChange()
      }
    },
    updateSelecteds() {
      const { selecteds, transferData } = this
      const selectedsLength = selecteds.length
      const dataLength = transferData.length
      this.selectionAll = Boolean(selectedsLength) && selectedsLength === dataLength
      this.indeterminate = Boolean(selectedsLength && selectedsLength < dataLength)
    },
    setDataMap() {
      this.dataMap.clear()
      const { key } = this.props
      this.transferData.forEach(d => {
        this.dataMap.set(d[key], d)
      })
    },
    clearSelection() {
      this.checkedsSet.clear()
      this.selectionChange()
    },
    toggleRowSelection(row, selected) {
      const { dataMap, props, toggleSelection, checkedsSet } = this
      const id = row[props.key]
      if (dataMap.has(id)) {
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
      const { checkeds, dataMap, props, toggleSelection, selectionChange } = this
      const id = row[props.key]
      if (isRadio) {
        this.checkedsSet.clear()
      }
      toggleSelection(row, !selected)
      this.$emit('select', checkeds, dataMap.get(id))
      selectionChange()
    },
    allselectionChange(selected) {
      const { dataMap, selectionChange } = this
      this.selectionAll = selected
      this.indeterminate = false
      selected ? this.checkedsSet = new Set(...Array(dataMap.keys())) : this.checkedsSet.clear()
      selectionChange()
      this.$emit('select-all', this.checkeds)
    },
    toggleSelection(row, has, selected) {
      const id = row[this.props.key]
      selected ? this.checkedsSet.add(id) : has ? this.checkedsSet.delete(id) : this.checkedsSet.add(id)

      this.selectionChange()
    },
    setCurrentRow(row) {
      const { dataMap, selectionChange } = this
      const id = row[this.props.key]
      this.checkedsSet.clear()
      if (dataMap.has(id)) {
        this.checkedsSet.add(id)
      }

      selectionChange()
    },
    selectionChange() {
      this.selecteds = [...this.checkedsSet]
      this.$forceUpdate()
    },
    isChecked(row) {
      const { selecteds } = this
      return selecteds.includes(row[this.props.key])
    },
    isDisabled(row) {
      return XEUtils.isFunction(row.disabled) ? row.disabled({ row }) : Boolean(row.disabled)
    }
  }
}
</script>
