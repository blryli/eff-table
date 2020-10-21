<template>
  <div class="eff-table__body-wrapper" :style="{height: table.heights.bodyHeight + 'px'}">
    <div class="eff-table__body--x-space" />
    <div class="eff-table__body--y-space" :style="{height:totalHeight + 'px'}" />
    <div class="eff-table__body" :style="{ marginTop: table.bodyMarginTop }">
      <TableBodyRow
        v-for="(row, index) in table.renderData"
        :key="index + table.renderIndex"
        :row="row"
        :row-index="index + table.renderIndex"
        :body-columns="bodyColumns"
        :messages="formatValidators[index + table.renderIndex]"
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
    totalHeight() {
      return this.data.length * this.table.rowHeight
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
    'table.scrollTop'(val) {
      this.$el.scrollTop = val
    },
    'table.minWidth'(val) {
      const { bodyWrapperWidth, scrollYwidth } = this.table
      val <= bodyWrapperWidth - scrollYwidth && (this.$el.scrollLeft = 0)
    }
  },
  mounted() {
    this.table.bodyLoad = true
    this.$nextTick(() => {
      on(this.$el, 'scroll', this.handleScroll, { passive: false })
    })
  },
  beforeDestroy() {
    off(this.$el, 'scroll', this.handleScroll, { passive: false })
  },
  activated() {
    this.handleScroll()
  },
  methods: {
    handleScroll(e) {
      if (!this.fixed) {
        const { scrollLeft } = this.table.$el.querySelector('.eff-table__body-wrapper')
        this.table.scrollLeft = scrollLeft
      }
      this.table.scrollTop = this.$el.scrollTop
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
}
.eff-table__body-wrapper{
  overflow-y: auto;
}

.eff-table__fixed-left{
  .eff-table__body-wrapper{
    &::-webkit-scrollbar { width: 0 !important }
  }
}

.eff-table__body-wrapper{
  overflow-x: hidden;
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
