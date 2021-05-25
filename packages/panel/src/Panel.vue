<template>
  <layout class="panel">
    <div
      class="panel-header flex-row"
      :class="{ collapsible: collapsible }"
      @click="collapse('vertical')"
    >
      <span
        v-show="!isCollapsed || deraction === 'vertical'"
        class="panel-title"
      >{{ title }}</span>
      <span
        v-show="!isCollapsed || deraction === 'vertical'"
        class="flex-space"
      />
      <!-- <v-render v-if="headerTools.name" :config="headerTools" @click.native.stop /> -->
      <slot name="header" />
      <i
        v-if="collapsible"
        class="el-icon-arrow-right"
        :class="{ icon2front: icon2front }"
        @click="collapse('horizontal')"
      />
    </div>
    <div v-show="!isCollapsed" class="panel-content">
      <slot />
    </div>
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

    // 折叠方向  前置条件[collapsible:true]  -- vertical:垂直  horizontal:水平
    deraction: { type: String, default: 'vertical' },

    // 是否前置操作图标
    icon2front: { type: Boolean, default: false },

    // 头部工具栏
    headerTools: {
      type: Object,
      default() {
        return {

        }
      }
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
        if (this.deraction === val) {
          this.isCollapsed = !this.isCollapsed
          if (val === 'horizontal') {
            this.iWidth = this.isCollapsed ? '45px' : ''
          }
          this.$emit('update:collapsed', this.isCollapsed)
          this.$emit('change', this.isCollapsed)
        }
      }
    }
  }
}
</script>
