<template>
  <div
    v-if="table.columnBatchControlText"
    class="eff-toobar--text"
    @click="$emit('change')"
  >{{ table.columnBatchControlText }}</div>
  <ColumnBatchCtrl
    v-else
    @click.native="$emit('change')"
  >
    <div v-for="v in 9" :key="v" class="eff-table--batch-control__point" />
  </ColumnBatchCtrl>
</template>

<script>
import ColumnBatchCtrl from 'pk/icon/src/columnBatchCtrl'
export default {
  name: 'ColumnBatchControlBtn',
  components: { ColumnBatchCtrl },
  inject: ['table']
}
</script>
