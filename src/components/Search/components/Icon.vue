<template>
  <i :class="'eff-icon-' + (icon === 'like' ? 'search' : icon)">{{ content }}</i>
</template>
<script>
export default {
  props: {
    operator: { type: Array, default: () => [] },
    icon: { type: String, default: 'like' }
  },
  computed: {
    content() {
      const { icon } = this.operator.find(d => d.type === this.icon) || {}
      return icon
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
[class^="eff-icon-"]{
  position: relative;
  width: 14px;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  font-size: 16px;
  text-align: center;
}
.eff-icon-search{
  position: relative;
  width: 14px;
  height: 14px;
  &::before{
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #888;
    border-radius: 50%;
  }
  &::after{
    content: '';
    position: absolute;
    top: 13px;
    left: 10px;
    transform: rotate(40deg);
    width: 4px;
    height: 1px;
    background-color: #888;
  }
}
.eff-icon-unequals{
  &::after{
    content: '';
    position: absolute;
    top: 3px;
    left: 7px;
    transform: rotate(30deg);
    width: 1px;
    height: 10px;
    background-color: #888;
  }
}
.eff-icon-lessthan, .eff-icon-greaterthan{
  font-size: 15px;
  &::after{
    content: '';
    position: absolute;
    top: 7px;
    left: 7px;
    transform: rotate(-60deg);
    width: 1px;
    height: 9px;
    background-color: #888;
  }
}
.eff-icon-greaterthan{
  &::after{
    left: 8px;
    transform: rotate(60deg);
  }
}
</style>
