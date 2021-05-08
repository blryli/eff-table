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
