<template>
  <div v-show="!disabled" class="v-triangle" :style="style" :title="message" />
</template>

<script>
import { getDomClientRect } from 'pk/form/utils/dom'
export default {
  name: 'VTriangle',
  props: {
    referenceId: {
      type: String,
      required: true
    },
    effect: {
      type: String,
      default: '#F56C6C'
    },
    message: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'right-bottom',
      validator(val) {
        return ['left-top', 'left-bottom', 'right-top', 'right-bottom'].indexOf(val) !== -1
      }
    },
    disabled: Boolean,
    size: {
      type: [String, Number],
      default: '8px'
    }
  },
  data() {
    return {
      reference: null
    }
  },
  computed: {
    referenceRect() {
      return getDomClientRect(document.getElementById(this.referenceId))
    },
    style() {
      const { placement, effect, size } = this
      const pos = placement.split('-').reduce((acc, cur) => {
        acc[cur] = 0
        acc[`border-${cur}-color`] = effect
        return acc
      }, {})
      return {
        border: `${parseInt(size) / 2}px solid transparent`,
        ...pos
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-triangle {
  position: absolute;
  width: 0;
  height: 0;
  z-index: 1;
}
</style>
