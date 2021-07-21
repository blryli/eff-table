<template>
  <span class="eff-icon--subtotal" title="小计">
    <div class="eff-icon--subtotal-container">
      <div class="eff-icon--subtotal-plus" />
      <div class="eff-icon--subtotal-line" />
      <div class="eff-icon--subtotal-equal" />
    </div>
  </span>
</template>

<script>
export default {
  name: 'Subtotal'
}
</script>

<style lang="scss">
.eff-icon--subtotal{
  display: inline-block;
  vertical-align: middle;
  &-container{
    position: relative;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
  }
  &:hover{
    cursor: pointer;
  }

  &-plus{
    position: absolute;
    left: 0;
    top: 0;
    width: 8px;
    height: 8px;
    box-sizing: border-box;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: 3px;
      width: 8px;
      height: 2px;
      background-color: #999;
    }
    &::after{
      content: '';
      position: absolute;
      left: 3px;
      top: 0;
      width: 2px;
      height: 8px;
      background-color: #999;
    }
  }
  &-line{
    position: absolute;
    left: -3px;
    bottom: 7px;
    width: 22px;
    height: 1px;
    background-color: #999;
    transform: rotate(-45deg);
  }
  &-equal{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 6px;
    height: 6px;
    box-sizing: border-box;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 6px;
      height: 2px;
      background-color: #999;
    }
    &::after{
      content: '';
      position: absolute;
      left: 0;
      bottom: 5px;
      width: 6px;
      height: 2px;
      background-color: #999;
    }
  }
  &:hover{
    .eff-icon--subtotal-equal{
      &::after{
        animation: effRotate 1s infinite;
      }
    }
  }
}
@keyframes effRotate {
  0%{
    transform: rotate(0);
  }
  30%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(-360deg);
  }
}
</style>
