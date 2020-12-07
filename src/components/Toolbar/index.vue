<template>
  <div class="table-toobar">
    <div class="table-toobar__left">
      <slot />
    </div>
    <div class="table-toobar__right">
      <Clear v-if="table.search && table.searchClear" />
      <ColumnCtrlBtn v-if="table.columnControl" @change="btnChange" />
      <Fullscreen v-if="table.fullscreen" />
    </div>
  </div>
</template>

<script>
import Fullscreen from './Fullscreen'
import ColumnCtrlBtn from './ColumnCtrlBtn'
import Clear from './Clear'
export default {
  name: 'Toolbar',
  components: { Fullscreen, ColumnCtrlBtn, Clear },
  inject: ['table'],
  methods: {
    btnChange() {
      this.table.$refs.drag.toggleCardShow()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-toobar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--rowHeight);
  padding: 0 5px;
  border: 1px solid #ddd;
  border-bottom: 0;
  background-color: #f6f7f8;
  box-sizing: border-box;
  &__left, &__right{
    display: flex;
    align-items: center;
    > * + * {
      margin-left: 10px;
    }
  }
}
</style>
