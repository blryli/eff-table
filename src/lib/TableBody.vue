<template>
  <div class="eff-table__body-wrapper" :style="{height: bodyHeight + 'px'}">
    <div class="eff-table__body--x-space" />
    <div class="eff-table__body--y-space" :style="{height:totalHeight + 'px'}" />
    <div class="eff-table__body" :style="{ marginTop }">
      <TableBodyRow
        v-for="(row, index) in renderData"
        :key="index + rowRenderIndex"
        :row="row"
        :row-index="index + rowRenderIndex"
        :messages="formatValidators[index + rowRenderIndex]"
      />
      <div v-if="!data.length" class="empty-text" :style="{height: table.rowHeight + 'px'}">{{ table.emptyText }}</div>
    </div>
  </div>
</template>

<script>
import TableBodyRow from 'lib/TableBodyRow'
import { on, off } from 'utils/dom'

export default {
  name: 'TableBody',
  components: {
    TableBodyRow
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    validators: {
      type: Array,
      default: () => []
    },
    messages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollTop: 0,
      scrollIndex: 0,
      rowRenderIndex: 0,
      marginTop: 0
    }
  },
  inject: ['table'],
  computed: {
    formatValidators() {
      return (this.validators.concat(this.messages) || []).reduce((acc, cur, index) => {
        const rowIndex = `${cur.rowIndex}`
        if (!acc[rowIndex]) acc[rowIndex] = []
        acc[rowIndex].push(cur)
        return acc
      }, {})
    },
    renderData() {
      return this.isVirtual ? this.data.slice(this.rowRenderIndex, this.pageSize + this.rowRenderIndex) : this.data
    },
    bodyHeight() {
      return this.table.heights.bodyHeight
    },
    pageSize() {
      return parseInt(this.bodyHeight / this.table.rowHeight + 4)
    },
    totalHeight() {
      const { rowHeight } = this.table
      return this.data.length * rowHeight
    },
    isVirtual() {
      return this.data.length > this.pageSize
    }
  },
  watch: {
    'table.bodyScrollLeft'(val) {
      this.$el.scrollLeft = val
    },
    'table.minWidth'(val) {
      const { bodyWrapperWidth, scrollYwidth } = this.table
      val <= bodyWrapperWidth - scrollYwidth && (this.$el.scrollLeft = 0)
    },
    isVirtual(val) {
      if (!val) {
        this.rowRenderIndex = 0
        this.marginTop = 0
      }
    },
    scrollIndex(val) {
      const last = this.data.length - this.pageSize
      val > last - 2 && (val = last)
      const offset = Math.abs(val - this.rowRenderIndex)
      const { rowHeight } = this.table

      if (val < 2) {
        this.rowRenderIndex = 0
        this.marginTop = 0
      } else if (offset > 1) {
        this.rowRenderIndex = val
        const top = val === 2 ? rowHeight : rowHeight * 2
        if (this.scrollTop > top) {
          this.marginTop = this.scrollTop - top + 'px'
        }
      }
      if (val === last - 1) {
        this.marginTop = this.scrollTop - rowHeight + 'px'
        this.rowRenderIndex = last - 1
      }
      if (val === last) {
        this.marginTop = this.scrollTop + 'px'
        this.rowRenderIndex = last
      }
      this.$emit('row-render-index', this.rowRenderIndex)
    }
  },
  mounted() {
    this.table.bodyLoad = true
    this.$nextTick(() => {
      on(this.$el, 'scroll', this.handleScroll)
    })
  },
  beforeDestroy() {
    off(this.$el, 'scroll', this.handleScroll)
  },
  methods: {
    forceUpdate() {
      this.$el.forceUpdate()
    },
    handleScroll() {
      const { scrollLeft, scrollTop } = this.$el
      const { rowHeight } = this.table
      this.table.bodyScrollLeft = scrollLeft
      const last = this.totalHeight - this.pageSize * rowHeight
      this.scrollTop = scrollTop < last ? scrollTop : last

      if (this.isVirtual) {
        this.scrollIndex = parseInt(this.scrollTop / rowHeight)
        if (scrollTop < rowHeight) {
          this.marginTop = 0
          this.rowRenderIndex = 0
        }
      }
    },
    toScroll(rowIndex, cb) {
      setTimeout(() => {
        if (rowIndex < this.pageSize / 2) {
          this.$el.scrollTop = 0
        } else {
          this.$el.scrollTop = (rowIndex - this.pageSize / 2) * this.table.rowHeight
        }
        setTimeout(() => {
          cb && cb()
        }, 100)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.eff-table__body-wrapper{
  overflow: hidden;
}
.is-overflow--y {
  .eff-table__body-wrapper{
    overflow-y: auto;
  }
}
.is-overflow--x {
  .eff-table__body-wrapper{
    overflow-x: auto;
  }
}
.empty-text{
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
}
</style>
