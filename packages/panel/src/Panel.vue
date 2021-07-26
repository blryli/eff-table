<template>
  <layout class="panel" :class="{ collapsed: isCollapsed }">
    <el-card
      class="box-card"
      :body-style="{ padding: hasPadding ? '20px' : '20px 0' }"
    >
      <div v-if="title" slot="header" class="flex-row">
        <span class="header-text" @click="collapse">
          <i
            v-if="collapsible"
            class="colllapse-icon el-icon-caret-bottom"
          />{{ title }}</span>
        <div class="flex-grow" style="padding-left:10px">
          <slot name="header" />
        </div>
      </div>
      <div v-show="!isCollapsed" class="panel-content flex-warp flex-row">
        <slot />
      </div>
    </el-card>
  </layout>
</template>
<script>
export default {
  // 页面布局容器组件
  name: 'Panel',
  props: {
    // 标题
    title: { type: String, default: '' },

    // 是否可折叠
    collapsible: { type: Boolean, default: true },

    // 是否是折叠状态
    collapsed: { type: Boolean, default: false },

    // 是否显示padding
    hasPadding: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isCollapsed: this.collapsed
    }
  },

  watch: {
    collapsed(val) {
      this.isCollapsed = val
    }
  },
  methods: {
    collapse(val) {
      if (this.collapsible) {
        this.isCollapsed = !this.isCollapsed
        this.$emit('update:collapsed', this.isCollapsed)
        this.$emit('change', this.isCollapsed)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.panel {
  &.collapsed {
    .colllapse-icon {
      transform: rotate(-90deg);
      transform-origin: 8px 8px;
    }
    ::v-deep .el-card__body{
      display:none
    }
  }
  .header-text{
    font-weight: bold;
    color:#666
  }
  .colllapse-icon {
    margin-right: 5px;
    color: #bbb;
  }
}
</style>
