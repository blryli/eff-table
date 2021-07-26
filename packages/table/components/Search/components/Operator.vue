<template>
  <div class="eff-operator">
    <div v-for="(d, i) in data" :key="i" class="eff-operator-item" :class="{'is--active': d.type === active && d.type !== 'like'}" @click="typeChange(d.type)">
      <div class="eff-operator-icon">{{ d.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Operator',
  props: {
    type: { type: String, default: 'like' },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active: this.type
    }
  },
  watch: {
    type(val) {
      this.active = val
    }
  },
  methods: {
    typeChange(type) {
      this.active = type
      this.$emit('change', type)
    }
  }
}
</script>
