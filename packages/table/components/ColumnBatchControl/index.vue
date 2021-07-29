<template>
  <div class="drag-table">
    <card
      v-if="columnBatchControl"
      :show="show"
      title="列编辑"
      :init-style="cardStyle"
      :min-height="300"
      :height="300"
      :width="800"
      :min-width="400"
      @close="close"
      @save="save"
      @resetColumns="resetColumns"
    >
      <template slot="header">
        <div>
          <el-button type="default" size="mini" @click="resetColumns">还原</el-button>
          <el-button type="success" size="mini" @click="save">保存</el-button>
        </div>
      </template>
      <div class="main">
        <div class="left" :style="leftStyle">
          左固定
          <div class="list area-left" :data-key="leftList.length - 1">
            <template v-for="(d, i) in leftList.filter(d => !d.type || d.title)">
              <div
                :key="i"
                :data-key="i"
                class="item"
                :class="d.show ? 'active' : ''"
                @click.stop="clickShow(d)"
              >
                {{ d.title }}
              </div>
              <div
                :key="'-'+i"
                :data-key="i"
                class="blank"
                :class="willDragInIndex == i && willDragInArea == 'left' ? 'active': ''"
              />
            </template>
            <div
              v-if="!leftList.length"
              :data-key="-1"
              class="blank"
              :class="willDragInIndex == -1 && willDragInArea == 'left' ? 'active': ''"
            />
          </div>
        </div>
        <div class="center" :style="centerStyle">
          <div>列</div>
          <div class="list area-center" :data-key="centerList.length - 1">
            <template v-for="(d, i) in centerList">
              <div
                :key="i"
                :data-key="i"
                class="item"
                :class="d.show ? 'active' : ''"
                @click.stop="clickShow(d)"
              >
                {{ d.title }}
              </div>
              <div
                :key="'-'+i"
                :data-key="i"
                class="blank"
                :class="willDragInIndex == i && willDragInArea == 'center' ? 'active': ''"
              />
            </template>
          </div>
        </div>
        <div class="right" :style="rightStyle">
          右固定
          <div class="list area-right" :data-key="rightList.length - 1">
            <template v-for="(d, i) in rightList">
              <div
                :key="i"
                :data-key="i"
                class="item"
                :class="d.show ? 'active' : ''"
                @click.stop="clickShow(d)"
              >
                {{ d.title }}
              </div>
              <div
                :key="'-'+i"
                :data-key="i"
                class="blank"
                :class="willDragInIndex == i && willDragInArea == 'right' ? 'active': ''"
              />
            </template>
            <div
              v-if="!rightList.length"
              :data-key="-1"
              class="blank"
              :class="willDragInIndex == -1 && willDragInArea == 'right' ? 'active': ''"
            />
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
      cardStyle: {},
      willDragInIndex: -2,
      willDragInArea: 'left',
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

    this.$nextTick(() => {
      const {
        handleDragend,
        handleDragenter,
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
              dragend: handleDragend,
              dragenter: handleDragenter,
              onEnd: handleEnd
            })
          }, 500)
        }

        calback('.left .list')
        calback('.center .list')
        calback('.right .list')
      }
    })
  },
  beforeDestroy() {},
  methods: {
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
    clickFixed(item, type) {
      if (item.fixed && item.fixed === type) {
        delete item.fixed
      } else {
        item.fixed = type
      }
      this.$forceUpdate()
    },
    toggleCardShow(e) {
      this.show = !this.show
    },
    close() {
      this.show = false
      this.$emit('cardClose')
    },
    reset() {},
    confirm() {},
    handleEnd(e) {
      const fromArea = e.fromEl.parentElement.className.replace(
        'list area-',
        ''
      )
      const fromIndex = e.fromEl.dataset.key

      const from = this[fromArea + 'List'].splice(fromIndex, 1)[0]
      this[this.willDragInArea + 'List'].splice(
        parseInt(this.willDragInIndex) + 1,
        0,
        from
      )

      this.willDragInArea = ''
      this.willDragInIndex = -2
    },
    handleDragend(e) {},
    handleDragenter(e) {
      this.willDragInArea = e.to.className.replace('list area-', '')
      this.willDragInIndex = e.toEl.dataset.key
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  width: 100%;
  padding: 0;
  height: 100%;
}
.list {
  width: 100%;
  // height: 100%;
  display: flex;
  margin-top: 10px;
  height: calc(90% - 100px);
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ededed;
    margin-bottom: 5px;
    border-radius: 4px;
    padding: 5px 10px;
    color: #aaa;
    border: 1px solid #ddd;
    .act {
      margin-right: 10px;
      font-size: 16px;
      opacity: .4;
    }
  }
  .active {
    color: #333;
    &.act{
      opacity: 1;
      border-color: #ccc;
    }
  }
}

.left {
  border-right: 1px solid #ededed;
  height: 97%;
  width: 20%;
  text-align: center;
  display: flex;
  flex-direction: column;
}
.right {
  display: flex;
  flex-direction: column;

  border-left: 1px solid #ededed;
  height: 97%;
  // height: 100%;
  text-align: center;
  width: 20%;
}
.center {
  flex: 1;
  height: 97%;
  padding-top: 25px;
  padding: 0 10px;
}
.blank {
  border: unset;
  width: 7px;
  height: 30px;
  margin-left: 5px;
  border-left: 2px solid transparent;
}

.blank.active {
  border-color: #ddd;
}
</style>
