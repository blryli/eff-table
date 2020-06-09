<template>
  <div class="eff-table_footer" :class="{'is-border--top': table.bodyOverflowY}" :style="style">
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
.eff-table_footer{
  position: relative;
}
.is-border--top{
  border-top: 1px solid #ddd;
}
.is-overflow-y{
  .eff-table_footer{
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
