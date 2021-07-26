<template>
  <div class="v-steps-warp">
    <div class="steps-list">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item"
        :class="{
          finish: index < active,
          'not-last': index < steps.length - 1,
        }"
      >
        <i v-if="step.icon" :class="step.icon" />
        <span class="step-text" @click="clickHandler(step,index)">{{ $t(step.name) }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VSteps',
  components: {},
  props: {
    steps: {
      type: Array,
      default() {
        return []
      }
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    clickHandler(step, index) {
      this.$emit('click', step, index)
    }
  }
}
</script>

<style lang="scss" scoped >
.p-steps-warp {
  background: #f5f5f5;
}
.steps-list {
  display: flex;
  flex-direction: row;
  line-height: 42px;
  height: 42px;
  font-size: 13px;
  .step-item {
    flex-grow: 1;
    width: 100px;
    text-align: center;
    background: #f5f5f5;
    color: #999;
    position: relative;
    padding-left: 5px;
    &.not-last::before {
      content: "";
      position: absolute;
      top: 0;
      right: -21px;
      width: 0;
      height: 0;
      border-style: solid;
      z-index: 1000;
      border-width: 21px 0 21px 21px;
      border-color: transparent transparent transparent #f5f5f5;
    }
    &.not-last::after {
      content: "";
      position: absolute;
      top: -2px;
      right: -23px;
      width: 0;
      height: 0;
      border-style: solid;
      z-index: 999;
      border-width: 23px 0 23px 23px;
      border-color: transparent transparent transparent #fff;
    }
    &.finish {
      background: #00aa91;
      color: #f3f3f3;
      &.not-last::before {
        content: "";
        position: absolute;
        top: 0;
        right: -21px;
        width: 0;
        height: 0;
        border-style: solid;
        z-index: 1000;
        border-width: 21px 0 21px 21px;
        border-color: transparent transparent transparent #00aa91;
      }
      &.not-last::after {
        content: "";
        position: absolute;
        top: -2px;
        right: -24px;
        width: 0;
        height: 0;
        border-style: solid;
        z-index: 999;
        border-width: 23px 0 23px 23px;
        border-color: transparent transparent transparent #fff;
      }
    }
  }
}
</style>
