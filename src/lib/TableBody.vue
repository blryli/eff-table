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
        :body-columns="bodyColumns"
        :messages="formatValidators[index + rowRenderIndex]"
      />
      <div v-if="!data.length" class="empty-text" :style="emptyStyle">{{ table.emptyText }}</div>
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
    data: { type: Array, default: () => [] },
    bodyColumns: { type: Array, default: () => [] },
    validators: { type: Array, default: () => [] },
    messages: { type: Array, default: () => [] },
    fixed: Boolean
  },
  data() {
    return {
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
      return parseInt(this.bodyHeight / this.table.rowHeight + 6)
    },
    totalHeight() {
      const { rowHeight } = this.table
      return this.data.length * rowHeight
    },
    isVirtual() {
      return this.data.length > this.pageSize + 5
    },
    emptyStyle() {
      const { bodyWidth, rowHeight } = this.table
      return {
        width: bodyWidth + 'px',
        height: rowHeight + 'px'
      }
    }
  },
  watch: {
    'table.bodyScrollLeft'(val) {
      if (this.fixed) return
      this.$el.scrollLeft = val
    },
    'table.bodyScrollTop'(val) {
      this.$el.scrollTop = val
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
    'table.scrollIndex'(val) {
      const last = this.data.length - this.pageSize
      val > last - 2 && (val = last)
      const offset = Math.abs(val - this.rowRenderIndex)
      const { rowHeight } = this.table

      if (val < 2) {
        this.rowRenderIndex = 0
        this.marginTop = 0
      } else if (offset > 1) {
        this.rowRenderIndex = val
        const top = val === 2 ? rowHeight : rowHeight * 3
        if (this.table.bodyScrollTop > top) {
          this.marginTop = this.table.bodyScrollTop - top + 'px'
        }
      }
      if (val === last - 1) {
        this.marginTop = this.table.bodyScrollTop - rowHeight + 'px'
        this.rowRenderIndex = last - 1
      }
      if (val === last) {
        console.log('last')
        this.marginTop = this.totalHeight - this.pageSize * rowHeight + 'px'
        this.rowRenderIndex = last
      }
    }
  },
  mounted() {
    this.table.bodyLoad = true
    this.$nextTick(() => {
      on(this.$el, 'scroll', this.handleScroll)
      on(document, 'mousewheel', this.handleScroll, { passive: false })
    })
  },
  beforeDestroy() {
    off(this.$el, 'scroll', this.handleScroll)
  },
  activated() {
    this.handleScroll()
  },
  methods: {
    handleScroll(e) {
      // 模拟 Y 滚轮动效
      if (e.deltaY && document.querySelector('.eff-table').contains(e.target) && this.table.heights.bodyOverflowY) {
        e.preventDefault()
        let num = 0
        const timer = setInterval(() => {
          num += 1
          this.$el.scrollTop = this.$el.scrollTop + (e.deltaY > 0 ? num : -num)
          if (num === 10) clearInterval(timer)
        }, 16.5)
      }
      const { scrollLeft } = document.querySelector('.eff-table__body-wrapper')
      const { scrollTop } = this.$el
      const { rowHeight } = this.table
      this.table.bodyScrollLeft = scrollLeft
      this.table.bodyScrollTop = scrollTop

      if (this.isVirtual) {
        this.table.scrollIndex = parseInt(this.table.bodyScrollTop / rowHeight)
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

<style lang="scss">
.eff-table__body{
  box-sizing: border-box;

  &--x-space{
    width: 100%;
    height: 1px;
    margin-bottom: -1px;
  }
  &--y-space{
    width: 0;
    float: left;
  }
}
.eff-table__body-row{
  &:last-child{
    .eff-table__column{
      border-bottom: 1px solid transparent;
    }
  }
  &.is--hover{
    .eff-table__column {
      background-color: #f1f3f5;
    }
  }
  &.current-row .eff-table__column {
    background-color: #e8f4ff;
  }
  .eff-table__column{
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    &.is--message{
      background-color: #fda1a1;
      &:hover{
        background-color: #fda1a1;
      }
    }
  }
}

.is-border {
  .eff-table__column,
  .eff-table__search-empty,
  .header-title{
    border-left: 1px solid #ddd;
  }
  .is-first-right-fixed {
    .eff-table__search-empty{
      border-left-color: transparent;
    }
  }
}
.eff-table__body-row:last-child{
    .eff-table__column{
      border-bottom: 1px solid #ddd;
    }
  }
.is-overflow--y{
  .eff-table__body-row:last-child{
    .eff-table__column{
      border-bottom: none;
    }
  }
  .eff-table__body-wrapper{
    overflow-y: auto;
  }
  .eff-table__fixed-left{
    .eff-table__body-wrapper{
      overflow-y: hidden;
    }
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
