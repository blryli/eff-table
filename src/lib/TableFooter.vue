<template>
  <div class="eff-table__footer" :style="style">
    <TableBodyRow
      :row="row"
      :row-index="1"
      :body-columns="columns"
      summary
    />
  </div>
</template>

<script>
import TableBodyRow from './TableBodyRow'

export default {
  name: 'TableFooter',
  components: {
    TableBodyRow
  },
  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    sumText: { type: String, default: '总计' },
    summaryMethod: { type: Function, default: null },
    fixed: { type: String, default: '' }
  },
  inject: ['table'],
  computed: {
    style() {
      const { rowHeight } = this.table
      return {
        minHeight: rowHeight + 'px',
        lineHeight: rowHeight + 'px'
      }
    },
    row() {
      const { columns, data, fixed } = this
      if (typeof this.summaryMethod === 'function') {
        return this.summaryMethod({ columns, data })
      }
      return columns.reduce((acc, column, index) => {
        if (index === 0 && fixed !== 'right') {
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
      if (this.fixed) return
      this.$el.scrollLeft = val
    }
  }
}
</script>

<style lang="scss">

.eff-table__footer{
  position: relative;
  border-top: 1px solid #ddd;
  overflow-x: hidden;
  background-color: #f6f7f8;
  box-sizing: border-box;
  .eff-table__body-row{
    .eff-table__column{
      background-color: #f6f7f8;
    }
    &:hover .eff-table__column{
      background-color: #f6f7f8;
    }
  }
}
.is-overflow--y{
  .eff-table__wrapper, .eff-table__fixed-right{
    .eff-table__footer{
      &::after{
        content:  '';
        width: 1px;
        position: absolute;
        top: 0;
        right: 16px;
        bottom: 0;
        background-color: #ddd;
        box-sizing: border-box;
      }
    }
  }
}
</style>
