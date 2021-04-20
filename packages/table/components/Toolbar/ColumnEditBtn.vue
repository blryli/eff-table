<template>
  <div
    v-if="table.columnEditText"
    class="eff-toobar--text"
    @click="$emit('change')"
  >{{ table.columnEditText }}</div>
  <div
    v-else
    class="eff-table__column-edit"
    title="列编辑显示隐藏"
    @click="$emit('change')"
  >
    <div v-for="v in 9" :key="v" class="eff-table__column-edit__point" />
  </div>
</template>

<script>
export default {
  name: 'ColumnEditBtn',
  inject: ['table']
}
</script>

<style lang="scss">
.eff-table__column-edit{
  position: relative;
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  &__point {
    width: 26%;
    height: 26%;
    margin-right: 7%;
    background-color: #888;
    border-radius: 10px;
  }
  &:hover{
    cursor: pointer;
    .eff-table__column-edit__point:first-child {
        // animation: identifier 1s ease-in-out infinite;
    }
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
