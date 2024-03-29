<template>
  <div>
    <div class="eff-transfer" :style="{width, height: height + 'px'}">
      <TransferPanel
        ref="leftPanel"
        v-model="leftValue"
        panel="left"
        :data="data"
        :ids="leftIds"
        :title="transferTitles[0]"
        :props="transferProps"
        :expanded-all="expandedAll"
        :lazy="lazy"
        :load-method="loadMethod"
        :default-checked-keys="defaultCheckedKeys"
        :default-expanded-keys="defaultExpandedKeys"
        :transfer-data-store="dataStore"
        @change="leftChange"
        @lazy-data="lazyData"
      >
        <slot name="leftFooter" />
      </TransferPanel>
      <div class="eff-transfer__center">
        <button
          class="eff-transfer__center-btn-top"
          :class="{'is-disabled': !leftValue.length}"
          :disabled="!leftValue.length"
          @click="() => toRight()"
        >
          {{ transferButtonTexts[0] }}<i class="eff-icon-arrow-right" />
        </button>
        <button
          class="eff-transfer__center-btn-bottom"
          :class="{'is-disabled': !rightValue.length}"
          :disabled="!rightValue.length"
          @click="() => toLeft()"
        >
          <i class="eff-icon-arrow-left" />{{ transferButtonTexts[1] }}
        </button>
      </div>
      <TransferPanel
        ref="rightPanel"
        v-model="rightValue"
        panel="right"
        :data="data"
        :ids="rightIds"
        :title="transferTitles[1]"
        :props="transferProps"
        :expanded-all="expandedAll"
        :lazy="lazy"
        :load-method="loadMethod"
        :default-checked-keys="defaultCheckedKeys"
        :default-expanded-keys="defaultExpandedKeys"
        :transfer-data-store="dataStore"
        @change="rightChange"
        @lazy-data="lazyData"
      >
        <slot name="rightFooter" />
      </TransferPanel>
    </div>
    <!-- <p>data {{ data }}</p> -->
  </div>
</template>

<script>
import TransferPanel from './transfer-panel'

export default {
  name: 'EffTransfer',
  components: { TransferPanel },
  props: {
    value: { type: Array, default: () => ([]) },
    data: { type: Array, default: () => ([]) },
    titles: { type: Array, default: () => (['from', 'to']) },
    buttonTexts: { type: Array, default: () => ([]) },
    props: { type: Object, default: () => ({}) },
    defaultCheckedKeys: { type: Array, default: () => ([]) },
    defaultExpandedKeys: { type: Array, default: () => ([]) },
    expandedAll: Boolean,
    lazy: Boolean,
    loadMethod: { type: Function, default: () => {} },
    width: { type: String, default: '100%' },
    height: { type: Number, default: 360 },
    treeConfig: { type: Object, default: () => ({}) } // 树配置
  },
  provide() {
    return { transfer: this }
  },
  data() {
    return {
      dataStore: {},
      leftValue: [],
      leftIds: [],
      rightValue: [],
      rightIds: []
    }
  },
  watch: {
    data: {
      handler() {
        this.init()
        this.$nextTick(() => {
          this.leftPanel.setDataStore()
          this.rightPanel.setDataStore()
        })
      },
      deep: true
    },
    rightIds(val, oldVal) {
      let dir, changeKeys
      if (val.length > oldVal.length) {
        dir = 'right'
        changeKeys = val.filter(d => oldVal.indexOf(d) === -1)
      } else {
        dir = 'left'
        changeKeys = oldVal.filter(d => val.indexOf(d) === -1)
      }
      this.$emit('input', val)
      this.$emit('change', { rightKeys: val, dir, changeKeys })
    }
  },
  created() {
    const { props, buttonTexts, titles } = this
    Object.assign(this, {
      transferProps: Object.assign(props, { key: 'key', label: 'label', disabled: 'disabled', children: 'children' }),
      transferButtonTexts: [buttonTexts[0] || '', buttonTexts[1] || ''],
      transferTitles: [titles[0] || 'from', titles[1] || 'to']
    })
    this.init()
  },
  mounted() {
    this.leftPanel = this.$refs.leftPanel
    this.rightPanel = this.$refs.rightPanel
  },
  methods: {
    init() {
      this.setDataStore()
      const { value, data, dataStore, props } = this
      if (!this.loadData && data.length) {
        const { key } = props
        const isNumber = typeof data[0][key] === 'number'
        this.leftIds = Object.keys(dataStore).reduce((acc, cur) => {
          const id = isNumber ? +cur : cur
          const { parents } = dataStore[cur]
          return parents.find(d => value.includes(d)) || value.includes(id) ? acc : acc.concat(id)
        }, [])
        this.rightIds = [...new Set(value.reduce((acc, cur) => {
          const { childs } = dataStore[cur]
          return acc.concat(dataStore[cur].parents.concat(cur).concat(childs))
        }, []))]
        this.loadData = true
      }
    },
    setDataStore() {
      this.dataStore = {}
      const { props } = this
      const { key, children } = props
      const setStore = (data, parents = []) => {
        data.forEach(row => {
          const id = row[key]
          const childs = row[children]
          const siblings = parents.length ? data.reduce((acc, cur) => cur[key] === id ? acc : acc.concat(cur[key]), []) : []
          if (childs) setStore(childs, parents.concat(id))
          this.$set(this.dataStore, id, { id, row, parents, siblings })
        })
      }
      setStore(this.data)
      for (const key in this.dataStore) {
        const row = this.dataStore[key]
        const childs = []
        for (const k in this.dataStore) {
          const r = this.dataStore[k]
          r.parents.includes(row.id) && childs.push(r.id)
        }
        row.childs = childs
      }
      return this.$nextTick()
    },
    toRight(ids = this.leftValue.map(d => d.id)) {
      this.leftIds = this.leftIds.filter(id => !ids.includes(id))
      const parents = ids.reduce((acc, cur) => acc.concat(this.dataStore[cur].parents), [])
      this.rightIds = [...new Set(this.rightIds.concat(ids).concat(parents))]
      this.leftPanel.clearSelection()
    },
    toLeft(ids = this.rightValue.map(d => d.id)) {
      this.rightIds = this.rightIds.filter(id => !ids.includes(id))
      const parents = ids.reduce((acc, cur) => acc.concat(this.dataStore[cur].parents), [])
      this.leftIds = [...new Set(this.leftIds.concat(ids).concat(parents))]
      this.rightPanel.clearSelection()
    },
    lazyData({ panel, id, data }) {
      this[panel + 'Ids'].push(...data)
      this.$emit('lazy-data', { panel, id, data })
    },
    leftChange(checkedKeys, changeKeys) {
      this.$emit('left-check-change', { checkedKeys, changeKeys })
    },
    rightChange(checkedKeys, changeKeys) {
      this.$emit('right-check-change', { checkedKeys, changeKeys })
    }
  }
}
</script>

<style lang="scss">
.eff-transfer{
  display: flex;
  width: 100%;
  &-panel{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
    &__header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      background-color: #f5f6f7;
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
      small{
        color: #888;
        user-select: none;
      }
      .eff-table__checkbox{
        .eff-table__checkbox-label{
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
        &:hover{
          .eff-table__checkbox-label{
            color: #333;
          }
        }
      }
    }
    &__body{
      display: flex;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      &-wrapper{
        padding: 10px;
        flex: 1;
      }
      &--y-space{
        width: 0;
        float: left;
      }
    }
    &__footer{
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border-top: 1px solid #ddd;
      box-sizing: border-box;
    }
    &-node{
      display: flex;
      align-items: center;
      color: #666;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      >i{
        margin-right: 5px;
      }
      .tree-loading{
        margin-right: 2px;
      }
    }
  }
  &__center{
    width: 16%;
    min-width: 100px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    button{
      white-space: nowrap;
      cursor: pointer;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      -webkit-appearance: none;
      border: 1px solid #409eff;
      &:hover, &:focus{
        background: #66b1ff;
        border-color: #66b1ff;
      }
      &:active{
        background: #3a8ee6;
        border-color: #3a8ee6;
      }
      &.is-disabled{
        cursor: not-allowed;
        background: #a0cfff;
        border-color: #a0cfff;
      }
    }
    &-btn-top,&-btn-bottom{
      margin: 0;
      background-color: #409eff;
      padding: 8px 10px;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
    }
    &-btn-bottom{
      margin-top: 10px;
    }
  }
  &-blank{
    display: inline-block;
    width: 18px;
  }
  .eff-table__checkbox{
    width: 100%;
    overflow: hidden;
  }
}
</style>
