<template>
  <card
    :show="show"
    class="eff-replace"
    title="批量替换"
    :min-height="300"
    :height="500"
    :width="800"
    :min-width="400"
    @close="close"
  >
    <template slot="header">
      <el-button type="default" size="mini" @click="confirm"> 确定 </el-button>
    </template>
    <div class="eff-replace-container">
      <div class="eff-replace-left">
        <div class="eff-replace-left--list">
          <v-form
            ref="form"
            :data-index="0"
            :columns="leftColumns"
            :data="data"
            rowledge="10px"
          />
        </div>
        <div class="eff-replace-history">
          <div class="eff-replace-history-header">
            <strong>替换记录</strong>
            <span class="eff-replace-history-header--clear" @click="clearHistory">清除记录</span>
          </div>
          <div class="eff-replace-history-list">
            <div v-for="(d, i) in historyList" :key="i" class="eff-replace-history-item">
              {{ `第${d.rowIndex+1}行 [${d.title}] 列的值由 [${d.oldValue}] ${d.back ? '还原':'替换'}为 [${d.newValue}]` }} <span v-if="!d.back" class="eff-replace-history--back" @click="() => back(d)">还原</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hr" />
      <div class="eff-replace-right">
        <VRender :config="{name: 'input', props: {value: searchValue}, attrs: {placeholder:'搜索字段'}, on: {input: val => searchValue = val}}" />
        <div class="eff-replace-right--list">
          <template v-for="(d, i) in rightColumns">
            <div :key="i" :data-key="i" class="eff-replace-item">
              {{ d.title }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- {{ updateList }} -->
  </card>
</template>

<script>
import vForm from 'pk/form/src/form'

import Card from 'pk/card'
import { deepClone } from 'pk/utils/index'
import { hasClass } from 'pk/utils/dom'
import XEUtils from 'xe-utils'
import Sortable from 'pk/utils/sortable'

export default {
  name: 'TableReplace',
  components: { Card, vForm },
  props: {
    columns: { type: Array, default: () => [] }
  },
  dragToEl: {},
  data() {
    return {
      show: false,
      list: XEUtils.clone(this.columns, true),
      realColumns: [],
      searchValue: '',
      data: {},
      historyList: []
    }
  },
  inject: ['table'],
  computed: {
    columnsStore() {
      return this.list.reduce((acc, cur) => {
        const pos = cur.pos || 'right'
        acc[pos].push(cur)
        return acc
      }, { left: [], right: [] })
    },
    leftColumns() {
      return this.columnsStore.left.reduce((acc, cur) => {
        const { prop, options } = cur
        return acc.concat([{ prop: 'search' + prop, path: prop, itemRender: { name: 'select', options }, placeholder: '请选择替换内容', options: [{ label: 1, value: 1 }], title: cur.title, span: 13 }, { span: 8, placeholder: '请输入填充内容', prop: 'replace' + prop, path: prop, itemRender: cur.config }, { span: 3, itemRender: { name: 'button', props: { type: 'text', icon: 'el-icon-delete' }, on: { click: e => this.deleted(cur) }}}])
      }, [])
    },
    rightColumns() {
      return this.columnsStore.right.reduce((acc, cur) => {
        return (!this.searchValue || this.searchValue && cur.title.indexOf(this.searchValue) > -1) ? acc.concat([cur]) : acc
      }, [])
    }
  },
  watch: {
    'columns.length'() {
      this.list = XEUtils.clone(this.columns, true)
    }
  },
  mounted() {
    this.realColumns = deepClone(this.initColumns)
    this.$nextTick(() => {
      const { handleEnd } = this
      const id = Math.floor(Math.random() * 100000)
      this.cradsSortable = []
      const setSortable = (pos, idx) => {
        this.cradsSortable[idx] = new Sortable({
          el: this.$el.querySelector(`.eff-replace-${pos}--list`),
          group: id,
          dragClass: 'drag',
          chosenClass: 'is--draging',
          filter: 'v-form',
          onEnd: handleEnd
        })
      }
      ['left', 'right'].forEach((d, idx) => setSortable(d, idx))
    })
  },

  methods: {
    handleEnd({ fromIndex, toIndex, from, to, fromEl, toEl }) {
      // console.log({ fromIndex, toIndex, from, to, fromEl, toEl })
      const { list, table } = this
      const index = list.findIndex(d => d.title === fromEl.innerText)
      if (hasClass(to, 'eff-replace-left--list')) {
        list[index].pos = 'left'
        list[index].options = [{ label: '全部', value: '全部' }, { label: '空值', value: '空值' }].concat(table.tableData.reduce((acc, cur) => {
          const value = cur[list[index].prop]
          return value && !acc.find(d => d.label === value) ? acc.concat([{ label: value, value }]) : acc
        }, []))
      } else {
        list[index].pos = 'right'
      }
      this.list = [...list]
    },
    deleted(column) {
      const index = this.list.findIndex(da => [da].some(d => d === column))
      this.list[index].pos = 'right'
      this.list = [...this.list]
    },
    confirm() {
      if (!this.leftColumns.length) return
      const tableData = [...this.table.tableData]
      tableData.forEach((row, rowIndex) => {
        this.leftColumns.forEach((column) => {
          const { prop, path, title } = column
          const searchValue = this.data['search' + path]
          const replaceValue = this.data['replace' + path]
          const oldValue = row[path]

          if (!prop || prop.indexOf('search') < 0 || !searchValue) return

          let willReplace = false
          if (searchValue === '全部') {
            willReplace = true
          } else if (searchValue === '空值') {
            if (!oldValue) {
              willReplace = true
            }
          } else {
            if (oldValue === searchValue) {
              willReplace = true
            }
          }

          if (willReplace) {
            row[path] = replaceValue
            oldValue !== replaceValue && this.historyList.unshift({ title, column, rowIndex, oldValue, newValue: replaceValue, back: false })
          }
        })
        this.table.updateRow(row)
      })
      // this.close()
      this.$message.success('替换成功！')
    },
    open() {
      this.show = true
    },
    close() {
      this.show = false
    },
    clearHistory() {
      this.historyList = []
    },
    back(history) {
      const { title, rowIndex, column, oldValue, newValue } = history
      const row = this.table.tableData[rowIndex]
      row[column.path] = oldValue
      this.table.updateRow(row)
      this.historyList.unshift({ title, column, rowIndex, oldValue: newValue, newValue: oldValue, back: true })
      this.$message.success('还原成功！')
    }
  }
}
</script>
<style lang="scss" scoped>
.eff-replace{
  > *{
    font-size: 12px;
  }
  &-container {
    display: flex;
    width: 100%;
    height: 100%;
  }
  &-left{
    width: 100%;
    height: calc(100% - 100px);
    position: relative;
    flex: 1;
    padding-bottom: 100px;
    &--list{
      width: 100%;
      height: calc(100% - 100px);
    }
  }
  &-right{
    width: 40%;
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
  }
  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    border-radius: 4px;
    padding: 5px 10px;
    color: #666;
    border-color: #ccc;
    background-color: #e5e5e5;
    margin-right: 10px;
    margin-right: 10px;
    font-size: 12px;
    cursor: default;
    user-select: none;
    &.active {
      color: #fff;
      border-color: #888;
      background-color: #888;
    }
    &.is--draging{
      color: #fff;
      border-color: #666;
      background-color: #666;
    }
    &.drag{
      cursor: move;
    }
  }
  &-history{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1px solid #ddd;
    font-size: 12px;
    &-header{
      width: 100%;
      height: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &--clear{
        cursor: pointer;
        color: #409eff;
      }
    }
    &-list{
      height: 82px;
      overflow: auto;
      line-height: 18px;
    }
    &--back{
      color: #409eff;
      cursor: pointer;
    }
  }
}
.hr{
  width: 1px;
  height: 100%;
  background-color: #ddd;
  margin: 0 10px;
}
</style>
