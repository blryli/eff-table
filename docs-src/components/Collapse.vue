<template>
  <div class="collapse" :class="{ open: open }">
    <div class="toggle" @click="open = !open">
      {{ title }}
      <span class="icon" />
    </div>
    <div v-if="open" class="content"><slot /></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  },
  computed: {
    title() {
      return this.open ? '隐藏代码' : '显示代码'
    }
  }
}
</script>

<style lang="scss" scoped>
.toggle {
  padding: 12px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  color: #666;

  .icon {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    transition: transform .3s ease-in-out;
    transform-origin: center 10px;
    &::before{
      content: '';
      position: absolute;
      left: 3px;
      top: 8px;
      border: 6px solid transparent;
      border-top-color: #999;
    }
  }

  &:hover {
    color: $primary-color;
    background: $primary-bg-color;
    .icon::before{
      border-top-color: $primary-color;
    }
  }
}

.open {
  .toggle {
    .icon {
      transform: rotate(180deg);
    }
  }
}
</style>
