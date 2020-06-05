<template>
  <transition name="info">
    <div v-if="visible" class="info" :style="{'zIndex': 2000 + seed}">{{ message }}</div>
  </transition>
</template>

<script>
export default {
  name: 'Info',
  data() {
    return {
      visible: false,
      message: '',
      seed: 1,
      duration: 3000
    }
  },
  mounted() {
    this.setTimer()
  },
  methods: {
    setTimer() {
      setTimeout(() => {
        this.close()
      }, this.duration)
    },
    close() {
      this.visible = false
      setTimeout(() => {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  position: fixed;
  border: 1px solid #f1bb6a;
  padding: 15px 20px;
  top: -30px;
  left: 50%;
  background-color: #fdf6ec;
  transform: translate(-50%, 50px);
  color: #e6a23c;
  font-size: 14px;
  border-radius: 4px;
}
.info-enter-active {
  transition: all 0.3s;
}
.info-leave-active {
  transition: all 0.3s;
}
.info-enter,
.info-leave-to {
  transform: translate(-50%, 0);
  opacity: 0;
}
</style>

