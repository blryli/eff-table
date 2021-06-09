<template>
  <i :class="'eff-icon-' + (icon === 'like' ? 'search' : icon)" />
</template>
<script>
export default {
  name: 'Icom',
  props: {
    icon: { type: String, default: 'like' }
  }
}
</script>
