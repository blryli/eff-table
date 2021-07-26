<template>
  <span class="eff-table__clear" title="清空搜索">
    <div class="eff-table__clear-icon">
      <div class="eff-table__clear--top" />
      <div class="eff-table__clear--center" />
      <div class="eff-table__clear--bottom" />
    </div>
  </span>
</template>

<script>
export default {
  name: 'SearchClear'
}
</script>

<style lang="scss">
.eff-table__clear{
  display: inline-block;
  vertical-align: middle;
  &-icon{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 18px;
    height: 16px;
    box-sizing: border-box;
  }
  &:hover{
    cursor: pointer;
  }
  &--top{
    width: 8px;
    height: 6px;
    border: 2px solid #999;
    border-radius: 2px;
    box-sizing: border-box;
  }
  &--center{
    width: 100%;
    height: 6px;
    margin-top: -2px;
    border: 2px solid #999;
    border-radius: 2px;
    box-sizing: border-box;
  }
  &--bottom{
    position: relative;
    margin-top: -2px;
    width: 14px;
    height: 8px;
    border: 2px solid #999;
    box-sizing: border-box;
    &::before{
      content: '';
      position: absolute;
      bottom: 0;
      right: 2px;
      width: 2px;
      height: 2px;
      background-color: #999;
    }
    &::after{
      content: '';
      position: absolute;
      bottom: 0;
      right: 5px;
      width: 2px;
      height: 3px;
      background-color: #999;
    }
  }
  &:hover{
    animation: effIsmove .8s infinite;
    .eff-table__clear--bottom{
      animation: effSkewX .8s infinite;
    }
  }
}
@keyframes effIsmove {
  0%{
    transform: translateX(-2px);
  }
  25%{
    transform: translateX(0);
  }
  50%{
    transform: translateX(2px);
  }
  75%{
    transform: translateX(0);
  }
  100%{
    transform: translateX(-2px);
  }
}
@keyframes effSkewX {
  0%{
    transform: skewX(20deg);
  }
  25%{
    transform: skewX(0deg);
  }
  50%{
    transform: skewX(-20deg);
  }
  75%{
    transform: skewX(0deg);
  }
  100%{
    transform: skewX(20deg);
  }
}
</style>
