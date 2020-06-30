<template>
  <div class="eff-table__search" :style="styles">
    <!-- <Range ref="tableRange" :range="tableSearchRange" @show="handleShow" @close="handleClose" /> -->
    <SearchColumn
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      :column="column"
      :column-index="columnIndex"
    />
    <div v-if="showSpace" class="eff-table__column is--space" />
  </div>
</template>

<script>
import SearchColumn from './SearchColumn'

export default {
  name: 'TableSearch',
  components: {
    SearchColumn
  },
  props: {
    columns: { type: Array, default: () => [] },
    styles: { type: Object, default: () => {} },
    showSpace: Boolean
  },
  data() {
    return {
      tableSearchRange: {},
      searchData: [],
      filters: []
    }
  },
  inject: ['table'],
  provide() {
    return { tableSearch: this }
  },
  created() {
    this.searchData = this.columns.reduce((acc, cur) => acc.concat([{ prop: cur.prop, value: '', type: cur.operatorDefault || 'like' }]), [])
    this.$on('search.icon.change', this.handleSearchIconChange)
    this.$on('search.change', this.handleSearchChange)
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
  beforeDestroy() {
    this.$off('search.icon.change', this.handleSearchIconChange)
    this.$off('search.change', this.handleSearchChange)
  },
  methods: {
    handleSearchIconChange(val) {
      this.tableSearchRange = val
    },
    handleSearchChange(val) {
      const index = this.filters.findIndex(d => d.field === val.field)
      if (val.content) {
        index > -1 ? this.filters.splice(index, 1, val) : this.filters.push(val)
      } else {
        this.filters.splice(index, 1)
      }
      // console.log('handleSearchChange', JSON.stringify(this.filters, null, 2))
      this.$emit('change', this.filters)
    },
    handleShow(val) {
      this.table.$emit('rangeShow', val)
    },
    handleClose(val) {
      this.table.$emit('rangeClose', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-search-hidden{
  display: none;
}
</style>
