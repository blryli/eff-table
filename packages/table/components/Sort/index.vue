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
  },
  data() {
    return {
      visible: false,
      columns: [],
      currentIndex: null,
      draging: false
    }
  },
  inject: ['table'],
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
        const { handleEnd } = this
        this.columnSortable = new Sortable({
          el: this.$refs.sortList,
          group: 'sort-list',
          dragClass: 'drag',
          chosenClass: 'is--draging',
          onEnd: handleEnd
        })
      })
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
      this.table.tableColumns = [...this.columns]
      this.table.sortChange()
    },
    sortClick(order, column) {
      this.$set(column, 'order', column.order === order ? '' : order)
    },
    handleEnd({ fromIndex, toIndex }) {
      const { columns } = this
      const oldItem = columns.splice(fromIndex, 1)[0]
      columns.splice(toIndex, 0, oldItem)
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
    &.is--draging{
      background-color: #c7daf1;
    }
  }
}
</style>
