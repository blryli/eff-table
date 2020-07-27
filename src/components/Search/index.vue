<template>
  <div class="eff-table__search" :style="styles">
    <!-- <Range ref="tableRange" :range="tableSearchRange" @show="handleShow" @close="handleClose" /> -->
    <SearchColumn
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      :column="column"
      :column-index="columnIndex"
      :popover.sync="popover"
      :config="operatorConfig"
    />
    <Popover placement="bottom" :show="popover.show" :reference="popover.reference">
      <div v-for="(d, i) in operatorConfig" :key="i" :class="{'is-active': d.type === d.type && d.type !== 'like'}" @click="typeChange(d.type)">
        <div class="dropdown-icon">{{ d.label }}</div>
      </div>
    </Popover>
    <div v-if="showSpace" class="eff-table__column is--space" />
  </div>
</template>

<script>
import SearchColumn from './SearchColumn'
import Popover from '../Popover'

export default {
  name: 'TableSearch',
  components: {
    SearchColumn, Popover
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
      filters: [],
      popover: {
        show: false,
        reference: null,
        prop: ''
      },
      operatorConfig: [
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
    },
    typeChange(type) {
      console.log(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-search-hidden{
  display: none;
}
</style>
