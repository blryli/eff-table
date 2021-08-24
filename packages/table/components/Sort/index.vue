<template>
  <div class="eff-table--multiple-sort">
    <card
      :show="visible"
      title="自定义排序"
      :min-width="400"
      :min-height="300"
      :width="800"
      :height="300"
      @close="close"
    >
      <template slot="header">
        <div>
          <el-button type="default" size="mini" @click="visible = false"> 取消 </el-button>
          <el-button type="default" size="mini" @click="confirm"> 确定 </el-button>
        </div>
      </template>
      <div ref="sortList" class="multiple-sort--list">
        <template v-for="(d, i) in columns">
          <div v-if="d.title" :key="i" class="multiple-sort--item">
            <div class="multiple-sort--title">
              {{ d.title }}
            </div>
            <span class="eff-cell--sort">
              <i
                :class="{ 'eff-cell--sort-asc': true, 'is--active': d.order === 'asc' }"
                @click="() => sortClick('asc', d)"
              />
              <i
                :class="{ 'eff-cell--sort-desc': true, 'is--active': d.order === 'desc' }"
                @click="() => sortClick('desc', d)"
              />
            </span>
          </div>
        </template>
      </div>
    </card>
  </div>
</template>

<script>
import Card from 'pk/card'
import XEUtils from 'xe-utils'
import Sortable from 'pk/utils/sortable'

export default {
  name: 'TableMultipleSort',
  components: { Card },
  props: {
    initColumns: { type: Array, default: () => [] },
    columnControl: Boolean
  },
  dragToEl: {},
  data() {
    return {
      visible: false,
      columns: [],
      currentIndex: null,
      draging: false
    }
  },
  inject: ['table'],
  computed: {

  },
  watch: {

  },
  mounted() {
    this.initSortable()
  },
  activated() {
    this.initSortable()
  },
  deactivated() {
    this.columnSortable = null
  },
  beforeDestroy() {
    this.columnSortable = null
  },
  methods: {
    initSortable() {
      this.$nextTick(() => {
        const { handleDragenter } = this
        this.columnSortable = new Sortable({
          el: this.$refs.sortList,
          group: 'sort-list',
          dragenter: handleDragenter
        })
      })
    },
    handleDragenter({ from, to, fromEl, toEl, fromIndex, toIndex, target }) {
      if (fromEl === toEl || target === to || toEl === to || fromIndex === toIndex || this.draging) return
      this.draging = true
      // console.log({ from, to, fromEl, toEl, fromIndex, toIndex })
      // 动画，待完成
      // const { left: fromLeft, top: fromTop } = fromEl.getBoundingClientRect()
      // const { left: toLeft, top: toTop, width: toWidth } = toEl.getBoundingClientRect()
      // const fromX = toLeft - fromLeft
      // const toX = fromLeft - toLeft
      // const fromY = toTop - fromTop
      // const toY = fromTop - toTop
      // if (fromTop > toTop) {
      //   this.currentIndex >= toIndex ? from.insertBefore(fromEl, toEl) : from.insertBefore(toEl, fromEl)
      //   toEl.style.transform = `translate3d(${-(toWidth + 10)}px, 0, 0)`
      //   fromEl.style.transform = `translate3d(${-fromX}px, ${-fromY}px, 0)`
      //   setTimeout(() => {
      //     Object.assign(fromEl.style, { transition: 'all .3s', transform: `translate3d(0, 0, 0)` })
      //     console.log({ fromEl, toEl })
      //     Object.assign(toEl.style, { transition: 'all .3s', transform: `translate3d(0, 0, 0)` })
      //   }, 0)
      // } else {
      //   Object.assign(fromEl.style, { transition: 'all .3s', transform: `translate3d(${fromX}px, ${fromY}px, 0)` })
      //   Object.assign(toEl.style, { transition: 'all .3s', transform: `translate3d(${toX}px, ${toY}px, 0)` })
      // }
      // setTimeout(() => {
      //   fromEl.style = ''
      //   toEl.style = ''
      //   if (fromTop === toTop) {
      //     this.currentIndex >= toIndex ? from.insertBefore(fromEl, toEl) : from.insertBefore(toEl, fromEl)
      //   }
      //   this.currentIndex = toIndex
      //   this.draging = false
      // }, 300)
    },
    show() {
      this.columns = XEUtils.clone(this.table.tableColumns, true)
      this.visible = true
    },
    close() {
      this.visible = false
    },
    confirm() {
      this.visible = false
    },
    sortClick(order, column) {
      this.$set(column, 'order', column.order === order ? '' : order)
    }
  }
}
</script>
<style lang="scss" scoped>
.multiple-sort{
  &--list{
    display: flex;
    flex-wrap: wrap;
  }
  &--item{
    display: flex;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    margin-bottom: 10px;
    +.multiple-sort--item{
      margin-left: 10px;
    }
  }
}
</style>
