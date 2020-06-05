<template>
  <div class="v-table__body-wrapper" :style="style">
    <div class="v-table__body--x-space" />
    <div class="v-table__body--y-space" :style="{height:totalHeight + 'px'}" />
    <div v-if="data.length" class="v-table__body" :style="{ marginTop }">
      <TableBodyRow v-for="(item, index) in renderData" :key="index + currentIndex" :item="item" :index="index + currentIndex" />
    </div>
    <div v-else class="empty-text" :style="{height: table.rowHeight + 'px'}">没有数据</div>
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
    }
  },
  data() {
    return {
      scrollTop: 0,
      scrollIndex: 0,
      currentIndex: 0,
      marginTop: 0
    }
  },
  inject: ['table'],
  computed: {
    style() {
      const { table, bodyHeight } = this
      const { maxHeight } = table

      return {
        maxHeight: (maxHeight || bodyHeight || '') + 'px'
      }
    },
    renderData() {
      console.log({ currentIndex: this.currentIndex })
      return this.data.slice(this.currentIndex, this.pageSize + this.currentIndex)
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
      const { height } = table
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
        surHeight = height
      }
      return surHeight
    }
  },
  watch: {
    'table.bodyScrollLeft'(val) {
      this.$el.scrollLeft = val
    },
    scrollIndex(val) {
      const last = this.data.length - this.pageSize
      val > last - 2 && (val = last)
      const offset = Math.abs(val - this.currentIndex)
      const { rowHeight } = this.table

      if (val < 2) {
        this.currentIndex = 0
        this.marginTop = 0
      } else if (offset > 1) {
        this.currentIndex = val
        const top = val === 2 ? rowHeight : rowHeight * 2
        if (this.scrollTop > top) {
          this.marginTop = this.scrollTop - top + 'px'
        }
      }
      if (val === last - 1) {
        this.marginTop = this.scrollTop - rowHeight + 'px'
      }
      if (val === last) {
        this.marginTop = this.scrollTop + 'px'
      }
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
    handleScroll(e) {
      const { scrollLeft, scrollTop } = e.target
      this.table.bodyScrollLeft = scrollLeft
      const last = this.totalHeight - this.pageSize * this.table.rowHeight
      this.scrollTop = scrollTop < last ? scrollTop : last

      this.scrollIndex = parseInt(this.scrollTop / this.table.rowHeight)
      scrollTop === 0 && (this.marginTop = '0')
    }
  }
}
</script>

<style lang="scss" scoped>
.v-table__body-wrapper{
  overflow: auto;
}
.v-scroller {
  flex: 1;
  height: 100%;
  font-size: 12px;
  min-height: 30px;
}
</style>
<style>
.vue-recycle-scroller.is--fixed::-webkit-scrollbar {
    width: 0 !important;
    height: 0!important;
}
.vue-recycle-scroller__item-wrapper {
  min-width: var(--width) !important;
}
</style>
