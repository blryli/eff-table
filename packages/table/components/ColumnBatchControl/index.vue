<template>
  <div class="drag-table">
    <card
      v-if="columnBatchControl"
      :show="show"
      title="列批量控制"
      :min-height="300"
      :height="300"
      :width="800"
      :min-width="400"
      @close="close"
      @save="save"
    >
      <template slot="header">
        <div>
          <el-button size="mini" @click="resetColumns">还原</el-button>
          <el-button size="mini" @click="save">保存</el-button>
        </div>
      </template>
      <div class="eff-column__batch-control">
        <div class="eff-column__batch-control--left" :style="leftStyle">
          <div class="eff-column__batch-control--title">
            <span>左固定列</span> <small>({{ leftList.length }})</small>
          </div>
          <div class="eff-column__batch-control--list area-left" :data-key="leftList.length - 1">
            <template v-for="(d, i) in leftList">
              <div
                :key="i"
                :data-key="i"
                class="eff-column__batch-control--item"
                :class="d.show ? 'active' : ''"
                @click.stop="clickShow(d)"
              >
                {{ d.title || d.type }}
              </div>
            </template>
          </div>
        </div>
        <div class="eff-column__batch-control--center" :style="centerStyle">
          <div class="eff-column__batch-control--title">
            <span>基础列</span> <small>({{ centerList.length }})</small>
          </div>
          <div class="eff-column__batch-control--list area-center" :data-key="centerList.length - 1">
            <template v-for="(d, i) in centerList">
              <div
                :key="i"
                :data-key="i"
                class="eff-column__batch-control--item"
                :class="d.show ? 'active' : ''"
                @click.stop="clickShow(d)"
              >
                {{ d.title }}
              </div>
            </template>
          </div>
        </div>
        <div class="eff-column__batch-control--right" :style="rightStyle">
          <div class="eff-column__batch-control--title">
            <span>右固定列</span> <small>({{ rightList.length }})</small>
          </div>
          <div class="eff-column__batch-control--list area-right" :data-key="rightList.length - 1">
            <template v-for="(d, i) in rightList">
              <div
                :key="i"
                :data-key="i"
                class="eff-column__batch-control--item"
                :class="d.show ? 'active' : ''"
                @click.stop="clickShow(d)"
              >
                {{ d.title }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import Card from 'pk/card'
import Sortable from 'pk/utils/sortable'
import { deepClone } from 'pk/utils/index'

export default {
  name: 'TablecolumnBatchControl',
  components: { Card },
  props: {
    initColumns: { type: Array, default: () => [] },
    columnBatchControl: Boolean
  },
  dragToEl: {},
  data() {
    // const { offsetHeight } = this.table.$el

    return {
      columns: [],
      show: false,
      leftList: [],
      rightList: [],
      centerList: [],
      realColumns: []
    }
  },
  inject: ['table'],
  computed: {
    leftStyle() {
      return { width: this.leftList.length ? '25%' : '60px' }
    },
    centerStyle() {
      return 'auto'
    },
    rightStyle() {
      return { width: this.rightList.length ? '25%' : '60px' }
    }
  },
  watch: {
    initColumns: {
      immediate: true,
      handler(val) {
        this.columnsInit(val)
      }
    }
  },
  mounted() {
    this.realColumns = deepClone(this.initColumns)
    this.initSortable()
  },
  activated() {
    this.initSortable()
  },
  deactivated() {
    this.cradsSortable = null
  },
  beforeDestroy() {
    this.cradsSortable = null
  },
  methods: {
    toggleCardShow(e) {
      this.show = !this.show
    },
    initSortable() {
      this.$nextTick(() => {
        const {
          handleEnd,
          columnBatchControl,
          $el: cardEl
        } = this
        const id = Math.floor(Math.random() * 100000)
        if (columnBatchControl) {
          const calback = className => {
            setTimeout(() => {
              this.cradsSortable = new Sortable({
                el: cardEl.querySelector(className),
                group: id,
                dragClass: 'drag',
                chosenClass: 'is--draging',
                onEnd: handleEnd
              })
            }, 500)
          }

          calback('.eff-column__batch-control--left .eff-column__batch-control--list')
          calback('.eff-column__batch-control--center .eff-column__batch-control--list')
          calback('.eff-column__batch-control--right .eff-column__batch-control--list')
        }
      })
    },
    columnsInit(val) {
      const columns = deepClone(val)
      this.leftList = columns.filter(v => v.fixed && v.fixed === 'left')
      this.rightList = columns.filter(v => v.fixed && v.fixed === 'right')
      this.centerList = columns.filter(v => !v.fixed)
      this.columns = columns
    },
    resetColumns() {
      this.columns = deepClone(this.realColumns)
      this.columnsInit(this.columns)
    },
    save() {
      const columns = []
      const callback = (arr, type) => {
        arr.forEach(v => {
          if (type) {
            v.fixed = type
          } else {
            delete v.fixed
          }
          columns.push(v)
        })
      }
      callback(this.leftList, 'left')
      callback(this.centerList)
      callback(this.rightList, 'right')

      this.value = columns
      this.$emit('update:initColumns', columns)
      this.close()
      this.table.doLayout()
    },
    clickShow(item) {
      item.show = !item.show
    },
    close() {
      this.show = false
      this.$emit('cardClose')
    },
    handleEnd({ fromIndex, toIndex, from, to, fromEl, toEl }) {
      console.log({ fromIndex, toIndex, from, to, fromEl, toEl })
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
    height: calc(90% - 100px);
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
  }
  &--item {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ededed;
    margin-bottom: 5px;
    border-radius: 4px;
    padding: 5px 10px;
    color: #aaa;
    border: 1px solid #ddd;
    margin-right: 10px;
    cursor: move;
    margin-right: 10px;
    font-size: 12px;
    opacity: .6;
    &.active {
      color: #333;
      opacity: 1;
      border-color: #ccc;
    }
    &.is--draging{
      opacity: 1;
      border-color: #c7daf1;
      background-color: #c7daf1;
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
