<template>
  <div v-if="visible" class="eff-table__loading">
    <div class="eff-table__loading-icon" />
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    visible: Boolean
  }
}
</script>

<style lang="scss">
.eff-table__loading{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba($color: #000000, $alpha: .2);

  &-icon{
    position: relative;
    width: 40px;
    height: 40px;
    &::before{
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      content: '';
      background-color: #5EB980;
      border-radius: 50%;
      animation: effScale 3s ease-in-out infinite;
    }
    &::after{
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      content: '';
      background-color: #31a55b;
      border-radius: 50%;
      animation: effIconScale 3s ease-in-out infinite;
    }
  }
}

@keyframes effScale {
  0%{
    transform: scale(1.2, 1.2);
  }
  25%{
    transform: scale(.4, .4);
  }
  50%{
    transform: scale(1.2, 1.2);
  }
  75%{
    transform: scale(.4, .4);
  }
  100%{
    transform: scale(1.2, 1.2);
  }
}
@keyframes effIconScale {
  0%{
    transform: scale(0, 0);
  }
  25%{
    transform: scale(.6, .6);
  }
  50%{
    transform: scale(0, 0);
  }
  75%{
    transform: scale(.6, .6);
  }
  100%{
    transform: scale(0, 0);
  }
}
</style>
