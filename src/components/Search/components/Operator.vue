<template>
  <div class="operator">
    <div v-for="(d, i) in data" :key="i" class="operator-item" :class="{'is-active': d.type === active && d.type !== 'like'}" @click="typeChange(d.type)">
      <div class="dropdown-icon">{{ d.label }}</div>
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
  methods: {
    typeChange(type) {
      this.active = type
      this.$emit('change', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.operator{
  &-item{
    line-height: 24px;
    &:hover{
      color: #1177e8;
      cursor: pointer;
    }
  }

  .is-active{
    .dropdown-icon{
      color: #1177e8;
    }
  }
}
</style>
