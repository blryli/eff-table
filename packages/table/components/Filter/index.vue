<template>
  <Popover :id="table.tableId + 'filter'" ref="filterPopover" class="eff-table-filter" v-bind="filterPopoverOpts">
    <div class="eff-table-filter__content">
      <div v-for="(d, i) in filterPopoverOpts.column.filters" :key="i + filterPopoverOpts.column.columnId">
        <Checkbox :value="d.checked" :label="d.label" @change="val => checkboxChange(val, d)" />
      </div>
    </div>
    <div class="eff-table-filter__bottom">
      <span class="eff-table-filter__bottom-btn" :class="{'is--disabled': isDisabled}" @click="handleFilter">筛选</span>
      <span class="eff-table-filter__bottom-btn" @click="resetFilter">重置</span>
    </div>
  </Popover>
</template>

<script>
import Popover from 'pk/popover'
import Checkbox from 'pk/checkbox'
import XEUtils from 'xe-utils'

export default {
  name: 'EffFilter',
  components: { Popover, Checkbox },
  inject: ['table'],
  data() {
    return {
      filterPopoverOpts: { column: { filters: [] }}
    }
  },
  computed: {
    isDisabled() {
      const { table, filterPopoverOpts } = this
      const { filters: tableFilters } = table
      const { column } = filterPopoverOpts
      const { filters } = column
      const tableFilter = tableFilters.find(d => d.column.columnId === column.columnId)
      return !filters.find(d => d.checked) && (!tableFilter || tableFilter && !tableFilter.column.filters.find(d => d.checked))
    }
  },
  mounted() {
    Object.assign(this, {
      filterPopover: this.$refs.filterPopover
    })
  },
  methods: {
    toggleTipShow(opts) {
      if (!this.filterPopover) this.filterPopover = this.$refs.filterPopover
      const { column } = opts
      const { filterPopoverOpts } = this
      if (this.filterPopover && this.filterPopover.isVisible && filterPopoverOpts.column && column.columnId === filterPopoverOpts.column.columnId) {
        this.filterTipClose()
      } else {
        this.filterPopover.doHide()
        this.$nextTick(() => {
          this.filterTipShow(opts)
        })
      }
    },
    filterTipShow(opts) {
      this.filterPopover.doShow()
      this.filterPopoverOpts = opts
      const { column } = this.filterPopoverOpts
      const { prop } = column
      this.table.$emit('filter-visible', { column, prop, visible: true })
      // console.log('open', column.prop)
    },
    filterTipClose() {
      if (!this.filterPopover) this.filterPopover = this.$refs.filterPopover
      if (this.filterPopover.isVisible) {
        const { column } = this.filterPopoverOpts
        const { prop } = column
        this.filterPopover.doHide()
        this.table.$emit('filter-visible', { column, prop, visible: false })
        // console.log('close', column.prop)
      }
    },
    _getCheckedFilters() {
      const { visibleColumns } = this.table
      const filterList = []
      visibleColumns.filter(column => {
        const { prop, filters } = column
        const valueList = []
        const dataList = []
        if (filters && filters.length) {
          filters.forEach(item => {
            if (item.checked) {
              valueList.push(item.value)
              dataList.push(item.data)
            }
          })
          if (valueList.length) {
            filterList.push({ column, prop, values: valueList, datas: dataList })
          }
        }
      })
      return filterList
    },
    handleFilter(evnt) {
      const { filterPopoverOpts, isDisabled } = this
      if (isDisabled) return
      const { column } = filterPopoverOpts
      const { prop } = column
      const values = []
      const datas = []
      column.filters.forEach(item => {
        if (item.checked) {
          values.push(item.value)
          datas.push(item.data)
        }
      })
      const { tableColumns } = this.table
      this.table.tableColumns = [...tableColumns]

      const filterList = this._getCheckedFilters()
      this.table.filters = XEUtils.clone(filterList, true)
      this.$emit('filter-change', { column, prop, values, datas, filters: filterList, filterList }, evnt)
      this.filterTipClose()
    },
    resetFilter(evnt) {
      const { column } = this.filterPopoverOpts
      column.filters.forEach(d => {
        d.checked = false
      })
      this.updateColumns()
      this.handleFilter(evnt)
    },
    checkboxChange(val, item) {
      const { filterPopoverOpts } = this
      const { column } = filterPopoverOpts
      const { filters } = column
      if (filters && filters.length) {
        const filter = filters.find(d => d.value === item.value)
        filter.checked = val
      }
      this.filterPopoverOpts = { ...this.filterPopoverOpts }
      this.updateColumns()
    },
    updateColumns() {
      this.table.tableColumns = [...this.table.tableColumns]
    }
  }
}
</script>

<style lang="scss">
.eff-table-filter{
  &__content{
    min-width: 100px;
    max-height: 200px;
    overflow: auto;
  }
  &__bottom{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 10px;
    margin: 5px -11px 0;
    border-top: 1px solid #ddd;
    box-sizing: border-box;
    &-btn{
      display: inline-block;
      &:not(.is--disabled):hover{
        cursor: pointer;
        user-select: none;
        color: #409eff;
      }
    }
  }
}
</style>
