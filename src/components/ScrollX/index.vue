<template>
  <div class="eff-table__scrollx" @scroll="scrollEvent">
    <div class="eff-table__scrollx-content" :style="{width: table.bodyWidth + 'px', height: '1px'}" />
  </div>
</template>

<script>
export default {
  name: 'ScrollX',
  inject: ['table'],
  methods: {
    scrollEvent() {
      this.table.scrollLeft = this.table.$refs.body.$el.scrollLeft = this.$el.scrollLeft
    }
  }
}
</script>

<style lang="scss" scoped>
.eff-table__scrollx{
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 36px;
  overflow-x: auto;
  overflow-y: scroll;
}
</style>
