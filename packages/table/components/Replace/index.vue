<template>
  <div class="drag-table">
    <card
      :show="true"
      title="批量替换"
      :init-style="cardStyle"
      :min-height="300"
      :height="300"
      :width="800"
      :min-width="400"
      @close="close"
    >
      <template slot="header">
        <div>
          <el-button type="default" size="mini" @click="reset"> 重置 </el-button>
          <el-button type="default" size="mini" @click="confirm"> 确定 </el-button>
        </div>
      </template>
      <div class="main">
        <div class="center" :style="centerStyle">
          <div class="list area-center flex justify-around">
            <v-form
              class="full-width"
              :columns="formColumns"
              :data="data"
            />

          </div>
        </div>
        <div class="right" :style="rightStyle">
          所有字段
          <div class="action">
            <input placeholder="请输入字段名" @input="searchColumn">
            <div class="item" :class="showAll ? 'sel' : ''" @click.stop="showAll = !showAll">
              显示已选
            </div>
          </div>
          <div class="list area-right justify-center" :data-key="list.length - 1">
            <template v-for="(d, i) in showList">
              <div :key="i" :data-key="i" class="item" :class="selectList.find(v => v.prop == d.prop) ? 'sel' : ''" @click.stop="clickShow(d)">
                <i title="是否显示" class="act el-icon-view" :class="selectList.find(v => v.prop == d.prop) ? 'sel' : ''" />
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
import vForm from 'pk/form/src/form'

import Card from 'pk/card'
import Sortable from 'pk/utils/sortable'
import { deepClone } from 'pk/utils/index'

export default {
  name: 'TableReplace',
  components: { Card, vForm },
  props: {
    initColumns: { type: Array, default: () => [] },
    columnControl: Boolean
  },
  dragToEl: {},
  data() {
    return {
      selectList: [],
      list: [],
      cardStyle: {},
      willDragInIndex: -2,
      willDragInArea: 'left',
      realColumns: [],
      searchInput: '',
      replaceInput: '',
      showAll: false,
      data: {}
    }
  },
  inject: ['table'],
  computed: {
    showList() {
      if (this.showAll) {
        return this.selectList
      }

      return this.list
    },
    leftStyle() {
      return { width: this.leftList.length ? '25%' : '60px' }
    },
    centerStyle() {
      return 'auto'
    },
    rightStyle() {
      return { width: '25%' }
    },
    formColumns() {
      const columns = []
      this.selectList.map((v, k) => {
        columns.push({ prop: 'search' + k, itemRender: { name: 'select', options: v.options }, placeholder: '请选择替换内容', options: [{ label: 1, value: 1 }], title: v.title, span: 14 })
        columns.push({ span: 10, placeholder: '请输入填充内容', prop: 'replace' + k })
      })

      return columns
    }
  },
  watch: {
    initColumns: {
      immediate: true,
      handler(val) {
        this.all = []
        this.list = []
        const call = (arr) => {
          arr.forEach((v, k) => {
            if (!v.title) {
              return
            }
            this.all.push(v)
            this.list.push(v)
            // this.insertSelectList(v)
            if (v.children) {
              call(v.children)
            }
          })
        }
        call(val)
      }
    },
    selectList: {
      immediate: true,
      handler(val) {
        this.openSelect = this.selectList.map(v => false)
      }
    }
  },
  mounted() {
    this.realColumns = deepClone(this.initColumns)
    const { offsetHeight } = this.table.$el
    this.cardStyle = {
      bottom: 0,
      right: 0,
      width: 700,
      height: offsetHeight < 667 ? 667 : offsetHeight
    }

    this.$nextTick(() => {
      const { handleDragend, handleDragenter, handleEnd, columnControl, $el: cardEl } = this
      const id = Math.floor(Math.random() * 100000)
      if (columnControl) {
        const calback = (className) => {
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
  beforeDestroy() {

  },
  methods: {

    openSelectWindow(v) {
      v.openSelect = !v.openSelect
      this.$forceUpdate()
    },
    insertSelectList(v) {
      v.openSelect = false
      v.options = [{ label: '全部', value: '全部' }, { label: '空值', value: '空值' }]

      const tmp = []
      this.table.tableData.forEach(vv => {
        const value = vv[v.prop]
        if (tmp.indexOf(value) === -1) {
          tmp.push(value)
          v.options.push({
            label: value,
            value: value
          })
        }
      })
      this.selectList.push(v)
    },
    searchColumn(input) {
      input = input.data
      if (!input) {
        this.list = this.all
        return
      }
      this.list = this.all.filter(v => {
        return v.title.indexOf(input) !== -1
      })
    },
    clickShow(v) {
      const index = this.selectList.findIndex(vv => vv.prop === v.prop)
      if (index !== -1) {
        this.selectList.splice(index, 1)
      } else {
        this.insertSelectList(v)
      }
    },
    confirm() {
      this.table.tableData.forEach(row => {
        this.selectList.forEach((item, key) => {
          const searchValue = this.data['search' + key]
          const replaceValue = this.data['replace' + key]

          if (!searchValue) {
            return
          }

          let willReplace = false
          if (searchValue === '全部') {
            willReplace = true
          } else if (searchValue === '空值') {
            if (!row[item.column.prop]) {
              willReplace = true
            }
          } else {
            if (row[item.prop] === searchValue) {
              willReplace = true
            }
          }

          if (willReplace) {
            row[item.prop] = replaceValue
          }
        })
      })

      this.table.$forceUpdate()

      this.close()
    },
    reset() {
      // this.list = []
      this.selectList = []
    },
    close() {
      this.table.replaceControl = false
    },
    replace() {

    },
    insert() {

    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  // flex-direction: column;
  // align-items: center;
  width: 100%;
  padding: 0;
  height: 100%;
}

 input {
        -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 80%;
  }
  input:focus {
    outline: none;
      border-color: #409eff;
  }

.action {
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  // padding: 0px 20px;

  .item {
    width: 75%;
    margin-top: 10px;
  }
  .item+.item {
    margin-left: 10px;
  }
}

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
    background-color: #409EFF;
      color: white;
    }
.list {
  width: 100%;
  // height: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  height: calc(90% - 100px);
  flex-wrap: wrap;
  align-content: flex-start;
  > .item + .item {
    margin-left: 10px;
  }

  .mmitem {
    width: 100%;
    .selectWindow {
      position: absolute;
      left: 0;
      top: 28px;
      left: 19px;
      width: 80%;
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
