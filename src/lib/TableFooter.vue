<template>
  <div class="eff-table__footer" :style="style">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TableFooter',
  inject: ['table'],
  computed: {
    style() {
      const { rowHeight } = this.table
      return {
        minHeight: rowHeight + 'px',
        lineHeight: rowHeight + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.eff-table__footer{
  position: relative;
  border-top: 1px solid #ddd;
}
.is-overflow--y{
  .eff-table__footer{
    &::after{
      content:  '';
      width: 1px;
      position: absolute;
      top: 0;
      right: 17px;
      bottom: 0;
      background-color: #ddd;
    }
  }
}
</style>
