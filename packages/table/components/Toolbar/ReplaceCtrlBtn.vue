<template>
  <div
    class="eff-table__replace"
    title="替换和填充"
    @click="click"
  >
    <div class="eff-table__replace-icon">
      <div class="eff-table__replace-round" />
      <div class="eff-table__replace-range" />
    </div>
    <div class="eff-table__replace-icon symmetry">
      <div class="eff-table__replace-round" />
      <div class="eff-table__replace-range" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReplaceCtrlBtn',
  inject: ['table'],
  methods: {
    click() {
      this.table.replaceControl = !this.table.replaceControl
    }
  }
}
</script>

<style lang="scss">
.eff-table__replace{
  position: relative;
  display: flex;
  justify-items: center;
  align-items: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  transform: scale(0.95);
  &-icon{
    left: -2px;
    top: -4px;
    position: absolute;
    &.symmetry{
    transform: rotateZ(180deg);
    left: 5px;
    top: 5px;
    }
  }
  &-round{
    position: relative;
    width: 8px;
    height: 10px;
    font-size: 20px;
    left: 3px;
    top: 3px;
    border: 2px solid #888;
    border-left-color: transparent;
    border-bottom-color: transparent;
    border-right-color: transparent;
    border-radius: 50%;
    transform: rotate(312deg) scale(1);

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
  &-range{
    position: absolute;
    left: 1px;
    top: 12px;
    width: 7px;
    height: 7px;
    background-color: #888;
    z-index: 2;
  }
  &:hover{
    // animation: effRefresh 2s infinite;
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
