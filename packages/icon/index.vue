<template>
  <i :class="'eff-icon-' + (icon === 'like' ? 'search' : icon)">{{ content }}</i>
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
