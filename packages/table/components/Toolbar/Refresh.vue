<template>
  <Icon class="table-refresh" icon="refresh" title="刷新" @click.native="table.refresh" />
</template>

<script>
import Icon from 'pk/icon'
export default {
  name: 'Refresh',
  components: { Icon },
  inject: ['table']
}
</script>

<style lang="scss">
.table-refresh{
  &:hover{
    animation: effRefresh 2s infinite;
  }
}
@keyframes effRefresh {
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(-360deg);
  }
}
</style>
