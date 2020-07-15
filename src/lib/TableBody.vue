<template>
  <div class="eff-table__body-wrapper" :style="style">
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
      return (this.validators || []).reduce((acc, cur, index) => {
        const rowIndex = `${cur.rowIndex}`
        if (!acc[rowIndex]) acc[rowIndex] = []
        acc[rowIndex].push(cur)
        return acc
      }, {})
    },
    style() {
      const style = {}
      const { table, bodyHeight } = this
      const { maxHeight, height, isScreenfull } = table
      if (isScreenfull) {
        style.height = bodyHeight + 'px'
      } else {
        if (height) style.height = height + 'px'
        if (maxHeight) style.maxHeight = maxHeight + 'px'
        if (!height && !maxHeight) style.maxHeight = bodyHeight + 'px'
      }

      return style
    },
    renderData() {
      return this.isVirtual ? this.data.slice(this.rowRenderIndex, this.pageSize + this.rowRenderIndex) : this.data
    },
    pageSize() {
      return parseInt(this.bodyHeight / this.table.rowHeight + 4)
    },
    totalHeight() {
      const { rowHeight } = this.table
      return this.data.length * rowHeight
    },
    bodyHeight() {
      const { table } = this
      const { height, maxHeight } = table
      const { $el, isScreenfull } = table
      let surHeight = window.screen.height
      if (isScreenfull && $el) {
        const { toolbar, header } = table.$refs
        if (toolbar) {
          surHeight -= toolbar.$el.offsetHeight
        }
        if (header) {
          surHeight -= header.$el.offsetHeight
        }
      } else {
        surHeight = Math.max(height, maxHeight) || 400
      }
      return surHeight
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
      this.table.bodyScrollLeft = scrollLeft
      const last = this.totalHeight - this.pageSize * this.table.rowHeight
      this.scrollTop = scrollTop < last ? scrollTop : last

      if (this.isVirtual) {
        this.scrollIndex = parseInt(this.scrollTop / this.table.rowHeight)
        if (scrollTop < this.table.rowHeight) {
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
  overflow: auto;
}
.empty-text{
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
}
</style>
