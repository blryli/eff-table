<template>
  <div
    class="eff-table--batch-control"
    title="列编辑显示隐藏"
  >
    <span v-for="v in 9" :key="v" class="eff-table--batch-control__point" />
  </div>
</template>

<script>
export default {
  name: 'ColumnBatchControlIcon',
  inject: ['table']
}
</script>

<style lang="scss">
.eff-table--batch-control{
  display: inline-flex;
  flex-wrap: wrap;
  position: relative;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  box-sizing: border-box;
  &__point {
    width: 26%;
    height: 26%;
    margin-right: 7%;
    background-color: #888;
    border-radius: 10px;
  }
  &:hover{
    cursor: pointer;
  }
}

@keyframes identifier {
  0%{
    left: 1px;
    top: 1px;
    position: absolute;
  }
  90%{
    left: 7px;
    top: 7px;
    position: absolute;

  }
  100%{
    left: 7px;
    top: 7px;
    position: absolute;

  }
}
</style>
