<template>
  <div class="eff-table--summary">
    <TableBodyRow
      :row="row"
      :row-index="1"
      :body-columns="columns"
      summary
    />
  </div>
</template>

<script>
import TableBodyRow from '../../lib/TableBodyRow'

export default {
  name: 'Summary',
  components: {
    TableBodyRow
  },
  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    sumText: { type: String, default: '总计' },
    summaryMethod: { type: Function, default: null }
  },
  computed: {
    row() {
      const { columns, data } = this
      if (typeof this.summaryMethod === 'function') {
        return this.summaryMethod({ columns, data })
      }
      return columns.reduce((acc, column, index) => {
        if (index === 0) {
          acc[index] = this.sumText
          return acc
        }
        const { prop } = column
        const values = data.map(item => Number(item[prop]))
        const value = values.reduce((prev, curr) => !isNaN(Number(curr)) ? prev + curr : prev, 0)
        acc[index] = value
        return acc
      }, {})
    }
  },
  watch: {
    'table.scrollLeft'(val) {
      this.$el.scrollLeft = val
    }
  },
  inject: ['table']
}
</script>

<style lang="scss" scoped>

</style>
