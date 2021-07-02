<template>
  <div
    v-if="table.searchClearText"
    class="eff-toobar--text"
    @click="clear"
  >{{ table.searchClearText }}</div>
  <Icon v-else icon="clear-search" title="清空搜索" @click.native="clear" />
</template>

<script>
export default {
  name: 'Clear',
  inject: ['table'],
  methods: {
    clear() {
      this.table.clearSearch()
    }
  }
}
</script>
