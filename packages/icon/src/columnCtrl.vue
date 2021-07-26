<template>
  <span
    class="eff-table__column-ctrl"
    title="列显示隐藏"
  >
    <div class="eff-table__column-ctrl__front" />
    <div class="eff-table__column-ctrl__end" />
  </span>
</template>

<script>
export default {
  name: 'ColumnCtrlIcon'
}
</script>

<style lang="scss">
.eff-table__column-ctrl{
  display: inline-block;
  position: relative;
  width: 16px;
  height: 16px;

  &__front{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 10px;
    height: 8px;
    border: 2px solid #888;
    box-sizing: content-box;
    &::before, &::after{
      content: '';
      position: absolute;
      width: 3px;
      height: 2px;
      background-color: #888;
    }
    &::before{
      left: 1px;
      top: 1px;
      z-index: 1;
      box-shadow: 0 -1px 1px rgba($color: #fff, $alpha: 1.0);
    }
    &::after{
      top: 1px;
      right: 1px;
    }
  }

  &__end{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 6px;
    height: 6px;
    border: 2px solid #888;
    background-color: white;
    box-shadow: -1px -1px 1px rgba($color: #fff, $alpha: 1.0);
    box-sizing: content-box;
  }

  &:hover{
    cursor: pointer;

    .eff-table__column-ctrl__front{
      &::before{
        animation: identifier 1s ease-in-out infinite;
      }
    }
  }
}

@keyframes identifier {
  0%{
    left: 1px;
    top: 1px;
  }
  90%{
    left: 7px;
    top: 7px;
  }
  100%{
    left: 7px;
    top: 7px;
  }
}
</style>
