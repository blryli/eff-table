<template>
  <card
    :show="show"
    title="列批量控制"
    :min-height="300"
    :height="300"
    :width="800"
    :min-width="400"
    :title-suffix="{message: '单击切换列显示/隐藏，拖动调整列顺序'}"
    @close="close"
  >
    <template slot="header">
      <div>
        <el-button size="mini" @click="resetColumns">还原</el-button>
        <el-button type="primary" size="mini" @click="save">保存</el-button>
      </div>
    </template>
    <div class="eff-column__batch-control">
      <div class="eff-column__batch-control--left" :style="leftStyle">
        <div class="eff-column__batch-control--title">
          <span>左固定列</span> <small>({{ subfieldColumns.left.length }})</small>
        </div>
        <div class="eff-column__batch-control--list left" :data-index="0">
          <VCheckbox v-for="(d, i) in subfieldColumns.left" :key="i" v-model="d.show" class="eff-column__batch-control--item">{{ d.title || d.type }}</VCheckbox>
        </div>
      </div>
      <div class="eff-column__batch-control--center">
        <div class="eff-column__batch-control--title">
          <span>基础列</span> <small>({{ subfieldColumns.center.length }})</small>
        </div>
        <div class="eff-column__batch-control--list center" :data-index="subfieldColumns.left.length">
          <VCheckbox v-for="(d, i) in subfieldColumns.center" :key="i" v-model="d.show" class="eff-column__batch-control--item">{{ d.title || d.type }}</VCheckbox>
        </div>
      </div>
      <div class="eff-column__batch-control--right" :style="rightStyle">
        <div class="eff-column__batch-control--title">
          <span>右固定列</span> <small>({{ subfieldColumns.right.length }})</small>
        </div>
        <div class="eff-column__batch-control--list right" :data-index="subfieldColumns.left.length + subfieldColumns.center.length">
          <VCheckbox v-for="(d, i) in subfieldColumns.right" :key="i" v-model="d.show" class="eff-column__batch-control--item">{{ d.title || d.type }}</VCheckbox>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import Card from 'pk/card'
import Sortable from 'pk/utils/sortable'
import { hasClass } from 'pk/utils/dom'
import { getSubfieldColumns } from 'pk/utils'
import XEUtils from 'xe-utils'
import VCheckbox from 'pk/checkbox'

export default {
  name: 'TablecolumnBatchControl',
  components: { Card, VCheckbox },
  props: {
    value: { type: Array, default: () => ([]) }
  },
  dragToEl: {},
  data() {
    return {
      columns: XEUtils.clone(this.table.tableColumns, true),
      show: false
    }
  },
  inject: ['table'],
  computed: {
    leftStyle() {
      return { width: this.subfieldColumns.left.length ? '25%' : '60px' }
    },
    rightStyle() {
      return { width: this.subfieldColumns.right.length ? '25%' : '60px' }
    },
    subfieldColumns() {
      return getSubfieldColumns(this.columns)
    }
  },
  watch: {
    value(val) {
      this.columns = XEUtils.clone(val, true)
    }
  },
  mounted() {
    this.$nextTick(() => {
      const { handleEnd, $el: cardEl } = this
      const id = Math.floor(Math.random() * 100000)
      this.cradsSortable = []
      const setSortable = (pos, idx) => {
        this.cradsSortable[idx] = new Sortable({
          el: cardEl.querySelector(`.eff-column__batch-control--${pos} .eff-column__batch-control--list`),
          group: id,
          dragClass: 'drag',
          chosenClass: 'is--draging',
          onEnd: handleEnd
        })
      }
      ['left', 'center', 'right'].forEach((d, idx) => setSortable(d, idx))
    })
  },
  beforeDestroy() {
    this.cradsSortable = null
  },
  methods: {
    toggleCardShow(e) {
      this.show = !this.show
    },
    resetColumns() {
      this.columns = XEUtils.clone(this.value, true)
    },
    save() {
      this.$emit('input', this.columns)
      this.close()
      this.table.doLayout()
    },
    close() {
      this.show = false
      this.$emit('cardClose')
    },
    handleEnd({ fromIndex, toIndex, from, to, fromEl, toEl }) {
      // console.log({ fromIndex, toIndex, from, to, fromEl, toEl })
      const fromIdx = +from.getAttribute('data-index') + fromIndex
      const toIdx = +to.getAttribute('data-index') + toIndex
      const columns = XEUtils.clone(this.columns, true)
      // 变为左固定
      if (hasClass(to, 'left')) {
        columns[fromIdx].fixed = 'left'
      }
      // 变为右固定
      if (hasClass(to, 'right')) {
        columns[fromIdx].fixed = 'right'
      }
      // 取消固定
      if (hasClass(to, 'center')) {
        columns[fromIdx].fixed = ''
      }
      const oldItem = columns.splice(fromIdx, 1)[0]
      columns.splice(toIdx, 0, oldItem)
      this.columns = columns
    }
  }
}
</script>
<style lang="scss" scoped>
.eff-column__batch-control {
  display: flex;
  width: 100%;
  padding: 0;
  height: 100%;
  &--left {
    border-right: 1px solid #ededed;
    height: 97%;
    width: 20%;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  &--center {
    flex: 1;
    height: 97%;
    padding-top: 25px;
    padding: 0 10px;
  }
  &--right {
    display: flex;
    flex-direction: column;

    border-left: 1px solid #ededed;
    height: 97%;
    // height: 100%;
    text-align: center;
    width: 20%;
  }
  &--list {
    width: 100%;
    // height: 100%;
    display: flex;
    margin-top: 10px;
    height: calc(100% - 20px);
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
  }
  &--item {
    margin: 0 10px;
    &.is--draging{
      color: #fff;
    }
    &.drag{
      cursor: move;
    }
  }
  &--title{
    text-align: center;
    span{
      font-weight: bold;
      color: #888;
    }
  }
}
</style>
