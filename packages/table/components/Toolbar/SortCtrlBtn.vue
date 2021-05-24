<template>
  <div
    class="eff-table__sort flex justify-between"
    title="自定义排序"
    @click="click"
  >
    <div class="eff-table__sort-left" />
    <div class="eff-table__sort-right" />
  </div>

</template>

<script>
export default {
  name: 'SortCtrlBtn',
  inject: ['table'],
  methods: {
    click() {
      this.table.sortControl = !this.table.sortControl
    }
  }
}
</script>

<style lang="scss">
.eff-table__sort {
  width: 12px;
  height: 16px;
  position: relative;
  cursor: pointer;

  div {
    width: 3px;
    height: 14px;
    background-color: #888;
    position: relative;

    &::before {
      position: absolute;
      content: "";
      width: 2px;
      height: 5px;
            background-color: #888;
      transform: rotate(45deg);
      left: -1px;
      top: -1px;

    }
    &::after {
      position: absolute;
      content: "";
      width: 3px;
      height: 5px;
      background-color: #888;
      transform: rotate(315deg);
      left: 1px;
      top: -1px;
    }
  }
  &-right {
    transform: rotate(180deg);
  }
}
</style>
