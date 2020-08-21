<template>
  <i :class="[icon === 'like' ? 'el-icon-search' : 'search-icon-' + icon]">{{ content }}</i>
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

<style lang="scss" scoped>
[class^="search-icon-"]{
  position: relative;
  width: 14px;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  font-size: 16px;
  text-align: center;
}
.search-icon-unequals{
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
.search-icon-lessthan, .search-icon-greaterthan{
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
.search-icon-greaterthan{
  &::after{
    left: 8px;
    transform: rotate(60deg);
  }
}
</style>
