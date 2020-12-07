<template>
  <div v-if="visible" class="eff-loading">
    <div class="eff-loading-icon" />
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

<style lang="scss" scoped>

</style>
