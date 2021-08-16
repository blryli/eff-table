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
      <div class="multiple-sort--list">
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
      <!-- {{ columns }} -->
    </card>
  </div>
</template>

<script>
import Card from 'pk/card'
import XEUtils from 'xe-utils'

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
      columns: []
    }
  },
  inject: ['table'],
  computed: {

  },
  watch: {

  },
  mounted() {
  },
  methods: {
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
  }
  &--item{
    display: flex;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    +.multiple-sort--item{
      margin-left: 10px;
    }
  }
}
</style>
