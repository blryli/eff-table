<template>
  <div class="drag-table">
    <card
      v-if="columnControl"
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
            <template v-for="(d, i) in leftList">
              <div
                :key="i"
                :data-key="i"
                class="item"
                :class="d.show ? 'sel' : ''"
                @click.stop="clickShow(d)"
              >
                <i title="是否显示" class="act el-icon-view" :class="d.show ? 'sel' : ''" />
                {{ d.title }}
              </div>
              <div
                :key="'-'+i"
                :data-key="i"
                class="blank"
                :class="willDragInIndex == i && willDragInArea == 'left' ? 'sel': ''"
              />
            </template>
            <template v-if="!leftList.length">
              <div
                :data-key="-1"
                class="blank"
                :class="willDragInIndex == -1 && willDragInArea == 'left' ? 'sel': ''"
              />
            </template>
          </div>
        </div>
        <div class="center" :style="centerStyle">
          <div class="list area-center" :data-key="centerList.length - 1">
            <template v-for="(d, i) in centerList">
              <div
                :key="i"
                :data-key="i"
                class="item"
                :class="d.show ? 'sel' : ''"
                @click.stop="clickShow(d)"
              >
                <i title="是否显示" class="act el-icon-view" :class="d.show ? 'sel' : ''" />
                {{ d.title }}
              </div>
              <div
                :key="'-'+i"
                :data-key="i"
                class="blank"
                :class="willDragInIndex == i && willDragInArea == 'center' ? 'sel': ''"
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
                :class="d.show ? 'sel' : ''"
                @click.stop="clickShow(d)"
              >
                <i title="是否显示" class="act el-icon-view" :class="d.show ? 'sel' : ''" />
                {{ d.title }}
              </div>
              <div
                :key="'-'+i"
                :data-key="i"
                class="blank"
                :class="willDragInIndex == i && willDragInArea == 'right' ? 'sel': ''"
              />
            </template>
            <template v-if="!rightList.length">
              <div
                :data-key="-1"
                class="blank"
                :class="willDragInIndex == -1 && willDragInArea == 'right' ? 'sel': ''"
              />
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
    columnControl: Boolean
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
        columnControl,
        $el: cardEl
      } = this
      const id = Math.floor(Math.random() * 100000)
      if (columnControl) {
        const calback = className => {
          setTimeout(() => {
            this.cradsSortable = new Sortable({
              el: cardEl.querySelector(className),
              group: id,
              dragImage: {
                height: 30
              },
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
    min-width: 60px;
    margin-bottom: 5px;
    height: 30px;
    border-radius: 4px;
    padding: 0 4px;
    .act {
      margin-right: 10px;
      font-size: 16px;
    }
  }
  .sel {
    background-color: #409eff;
    color: white;
  }
}

.left {
  border-right: 1px solid #ededed;
  height: 97%;
  width: 20%;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}
.right {
  display: flex;
  flex-direction: column;

  border-left: 1px solid #ededed;
  height: 97%;
  // height: 100%;
  text-align: center;
  padding-top: 10px;
  width: 20%;
}
.center {
  flex: 1;
  display: flex;
  height: 97%;
  padding-top: 25px;
  padding: 0 10px;
}
.blank {
  border: unset;
  width: 10px;
  height: 30px;
  border-radius: 10px;
}

.blank.sel {
  background-color: rgba($color: #0bc7ff, $alpha: 0.6);
}
</style>
