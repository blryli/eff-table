
<template>
  <span class="eff-icon-eye">
    <span class="eff-icon-eye__box">
      <span class="eff-icon-eye__top" />
      <span class="eff-icon-eye__bottom" />
    </span>
  </span>
</template>

<script>
export default {
  name: 'Eye'
}
</script>

<style lang="scss">
.eff-icon-eye{
  position: relative;
  width: 16px;
  height: 16px;
  &__box{
    display: flex;
    flex-direction: column;
    width: 16px;
    height: 16px;
  }
  &__top{
    position: relative;
    width: 16px;
    height: 10px;
    overflow: hidden;
    box-sizing: border-box;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      bottom: -9px;
      display: block;
      width: 16px;
      height: 14px;
      border: 1px solid #333;
      border-radius: 50%;
      box-sizing: border-box;
    }
  }
  &__bottom{
    position: relative;
    width: 16px;
    height: 10px;
    overflow: hidden;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: -9px;
      display: block;
      width: 16px;
      height: 14px;
      border: 1px solid #333;
      border-radius: 50%;
      box-sizing: border-box;
    }
  }
  &::after{
    content: '';
    position: absolute;
    left: 5px;
    top: 5px;
    display: inline-block;
    width: 6px;
    height: 6px;
    border: 1px solid #333;
    border-radius: 100%;
    box-sizing: border-box;
  }
}
</style>
