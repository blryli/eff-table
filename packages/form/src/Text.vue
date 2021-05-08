<template>
  <v-slot v-show="!disabled" class="v-text" :class="'v-text__'+placement" :style="{color: effect}" :message="message" />
</template>

<script>
import VSlot from './Slot'
export default {
  name: 'VText',
  components: { VSlot },
  props: {
    referenceId: { type: String, default: '' },
    message: { type: [String, Object, Array], default: '' },
    disabled: Boolean,
    effect: { type: String, default: '' },
    placement: { type: String, default: 'bottom' }
  },
  data() {
    return {
      reference: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.reference = document.getElementById(this.referenceId)
      this.calculateCoordinate()
    })
  },
  methods: {
    calculateCoordinate() {
      const { $el, placement, reference } = this
      if (!$el) return
      switch (placement) {
        case 'top':
          this.$el.style.top = -$el.offsetHeight - 3 + 'px'
          break
        case 'right':
          this.$el.style.width = $el.offsetWidth + 'px'
          this.$el.style.left = reference.offsetWidth + 3 + 'px'
          break
        case 'bottom':
          break
        case 'left':
          this.$el.style.width = $el.offsetWidth + 'px'
          this.$el.style.left = -$el.offsetWidth - 3 + 'px'
          break
        default:
          console.error('placement 必须是 top/right/bottom/left')
      }
    }
  }
}
</script>

<style scoped>
.v-text {
  position: absolute;
  top: 0;
  left: 0;
  line-height: 1.2;
  color: #666;
  font-size: 12px;
}

.v-text.v-text__bottom {
  top: 100%;
  left: 0;
  padding-top: 4px;
}

.v-text.v-text__right,
.v-text.v-text__left {
  top: 50%;
  transform: translate(0, -50%);
}
</style>

