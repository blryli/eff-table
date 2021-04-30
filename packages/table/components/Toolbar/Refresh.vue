<template>
  <div
    class="eff-table__refresh"
    title="刷新"
    @click="click"
  >
    <div class="eff-table__refresh-icon">
      <div class="eff-table__refresh-blank" />
      <div class="eff-table__refresh-round" />
    </div>
    <div class="eff-table__refresh-icon symmetry">
      <div class="eff-table__refresh-blank" />
      <div class="eff-table__refresh-round" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Refresh',
  inject: ['table'],
  methods: {
    click() {
      this.table.commitProxy('query')
    }
  }
}
</script>

<style lang="scss">
.eff-table__refresh{
  position: relative;
  display: flex;
  justify-items: center;
  align-items: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  &-icon{
    left: -2px;
    top: -2px;
    position: absolute;
    &.symmetry{
    transform: rotateZ(180deg);
    left: 4px;
    top: 5px;
    }
  }
  &-round{
    position: relative;
    width: 10px;
    height: 10px;
    font-size: 20px;
    left: 3px;
    top: 3px;
    border: 2px solid #888;
    border-left-color: transparent;
    border-bottom-color: transparent;
    border-radius: 50%;
    transform: rotate(-15deg);

    // animation: rotate linear .5s infinite;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: -4px;
      width: 1.2px;
      height: 5px;
      background-color: #888;
      transform: rotate(20deg);
    }
    &::after{
      content: '';
      position: absolute;
      left: 1px;
      top: -1px;
      width: 1.2px;
      height: 5px;
      background-color: #999;
      transform: rotate(110deg);
    }
  }
  &-blank{
    position: absolute;
    left: 2px;
    top: 7px;
    width: 4px;
    height: 3px;
    background-color: #fff;
    z-index: 2;
    transform: rotate(35deg);
  }
  &:hover{
    animation: effRefresh 2s infinite;
  }
}
@keyframes effRefresh {
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(-360deg);
  }
}
</style>
