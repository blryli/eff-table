<template>
  <div
    class="eff-table__history"
  >
    <div
      :style="{transform: `rotate(90deg)`}"
      class="eff-table__history-item"
      :title="'撤销'"
      @click="prev"
    >
      <div class="eff-table__history-arrow" :class="{'eff-table__history-disable': currentIndex == -1}" />
    </div>
    <div
      :style="{transform: `rotate(270deg)`, marginLeft: '2px'}"
      class="eff-table__history-item"
      :title="'恢复'"
      @click="next"
    >
      <div class="eff-table__history-arrow" :class="{'eff-table__history-disable': currentIndex == stack.length - 1}" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Icon',
  props: {
    iconClass: { type: String, default: '' }
  },
  data() {
    return {
      stack: [],
      currentIndex: -1
    }
  },
  inject: ['table'],
  mounted() {
    this.table.$off('table-update-data', this.onDataChange)
    this.table.$on('table-update-data', this.onDataChange)
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    prev() {
      if (this.currentIndex == -1) {
        return
      }

      let data = this.stack[this.currentIndex]
      if (!Array.isArray(data)) {
        data = [data]
      }

      data = data.map(v => {
        v.content = v.oldData
        v.notUpdateTableEvent = true
        return v
      })

      this.currentIndex -= 1
      this.table.$emit('edit-fields', data)
    },
    next() {
      if (this.currentIndex === this.stack.length - 1) {
        return
      }
      this.currentIndex += 1

      let data = this.stack[this.currentIndex]
      if (!Array.isArray(data)) {
        data = [data]
      }

      data = data.map(v => {
        v.content = v.newData
        v.notUpdateTableEvent = true
        return v
      })

      this.table.$emit('edit-fields', data)
    },
    onDataChange(res) {
      this.stack.splice(this.currentIndex + 1)
      this.stack.push(res)
      this.currentIndex = this.stack.length - 1
    }
  }
}
</script>

<style lang="scss">
.eff-table__history {
  position: relative;
  // width: 33px;
  height: 16px;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  &-item {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
     &:hover{
    .eff-table__history-arrow{
    }
  }
  }
  &-arrow{
    width: 6px;
    height: 9px;
    background-color: #888;
    &::before {
      content: "";
      position: absolute;
      top: 13px;
      left: 2px;
      border: 6px solid transparent;
      border-top-color: #888;
    }
  }

  &-disable{
    background-color: #d0d0d0;
    &::before {
      border-top-color: #d0d0d0;
    }
  }

}
@keyframes history_effIdentifier {
  0%{
    transform: translateY(0);
  }

  100%{
    transform: translateY(1px);
  }
}
</style>
