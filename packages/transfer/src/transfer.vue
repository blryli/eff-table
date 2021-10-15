<template>
  <div>
    <div class="eff-transfer">
      <TransferPanel
        ref="leftPanel"
        v-model="leftValue"
        :data="leftData"
        :title="transferTitles[0]"
        :props="transferProps"
        :default-check="leftDefaultChecked"
        @change="leftChange"
      >
        <slot name="leftFooter" />
      </TransferPanel>
      <div class="eff-transfer__center">
        <button
          class="eff-transfer__center-btn-top"
          :class="{'is-disabled': !leftValue.length}"
          :disabled="!leftValue.length"
          @click="toRight"
        >
          {{ transferButtonTexts[0] }}<i class="eff-icon-arrow-right" />
        </button>
        <button
          class="eff-transfer__center-btn-bottom"
          :class="{'is-disabled': !rightValue.length}"
          :disabled="!rightValue.length"
          @click="toLeft"
        >
          <i class="eff-icon-arrow-left" />{{ transferButtonTexts[1] }}
        </button>
      </div>
      <TransferPanel
        ref="rightPanel"
        v-model="rightValue"
        :data="rightData"
        :title="transferTitles[1]"
        :props="transferProps"
        :default-check="rightDefaultChecked"
        @change="rightChange"
      >
        <slot name="rightFooter" />
      </TransferPanel>
    </div>
  </div>
</template>

<script>
import TransferPanel from './transfer-panel'
import XEUtils from 'xe-utils'

export default {
  name: 'EffTransfer',
  components: { TransferPanel },
  props: {
    value: { type: Array, default: () => ([]) },
    data: { type: Array, default: () => ([]) },
    titles: { type: Array, default: () => ([]) },
    buttonTexts: { type: Array, default: () => ([]) },
    props: { type: Object, default: () => ({}) },
    targetOrder: { type: String, default: 'original' }, // original / push / unshift
    leftDefaultChecked: { type: Array, default: () => ([]) },
    rightDefaultChecked: { type: Array, default: () => ([]) },
    leftDefaultExpanded: { type: Array, default: () => ([]) },
    rightDefaultExpanded: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      leftValue: [],
      leftData: [],
      rightValue: [],
      rightData: []
    }
  },
  computed: {
    rightKeys() {
      return this.rightData.map(d => d[this.transferProps.key])
    }
  },
  watch: {
    data() {
      this.init()
    },
    rightKeys(val, oldVal) {
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
      transferTitles: [titles[0] || 'left', titles[1] || 'right']
    })
    this.init()
  },
  mounted() {
    this.leftPanel = this.$refs.leftPanel
    this.rightPanel = this.$refs.rightPanel
  },
  methods: {
    init() {
      const { data, rightDefaultChecked, transferProps: { key }} = this
      this.leftData = XEUtils.clone(data, true)
      this.sourceData = XEUtils.clone(data, true)
      if (rightDefaultChecked.length) {
        const leftRemove = rightDefaultChecked.reduce((acc, cur) => {
          const index = this.leftData.findIndex(d => d[key] === cur)
          return index > -1 ? acc.concat(this.leftData.splice(index, 1)) : acc
        }, [])
        this.rightData.push(...leftRemove)
      }
    },
    toRight() {
      const { targetOrder } = this
      const addFunc = targetOrder === 'unshift' ? targetOrder : 'push'
      this.rightData[addFunc](...this.leftValue)
      this.remove(this.leftValue, this.leftData)
      if (targetOrder === 'original') {
        this.rightData = this.sourceData.filter(s => this.rightData.find(d => d.key === s.key))
      }
      this.leftPanel.clearSelection()
    },
    toLeft() {
      const { targetOrder } = this
      const addFunc = targetOrder === 'unshift' ? targetOrder : 'push'
      this.leftData[addFunc](...this.rightValue)
      this.remove(this.rightValue, this.rightData)
      if (targetOrder === 'original') {
        this.leftData = this.sourceData.filter(s => this.leftData.find(d => d.key === s.key))
      }
      this.rightPanel.clearSelection()
    },
    remove(value, data) {
      const { transferProps: { key }} = this
      value.forEach(v => {
        const index = data.findIndex(da => da[key] === v[key])
        if (index > -1) data.splice(index, 1)
      })
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
  &-panel{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 240px;
    height: 360px;
    border: 1px solid #ddd;
    border-radius: 4px;
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
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      overflow-x: hidden;
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
      >i{
        margin-right: 5px;
      }
    }
  }
  &__center{
    width: 100px;
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
  .eff-table__checkbox{
    width: 100%;
    overflow: hidden;
  }
}
</style>
