<template>
  <layout
    class="panel"
    type="row"
    :width="calWidth"
    :height="height"
    :flexibility="flexibility"
    :class="{
      collapsed: isCollapsed,
      vertical: deraction == 'vertical',
      horizontal: deraction == 'horizontal',
    }"
  >
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
      <v-render v-if="headerTools.name" :config="headerTools" @click.native.stop />
      <i
        v-if="collapsed"
        class="el-icon-arrow-right"
        :class="{ icon2front: icon2front }"
        @click="collapse('horizontal')"
      />
    </div>
    <layout
      v-if="!isCollapsed"
      class="panel-content"
      :type="type"
      :warp="warp"
      :flexibility="true"
      :justify-content="justifyContent"
    >
      <slot />
    </layout>
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

    // 布局方式  [row: 行布局 | col: 列布局 ]
    type: { type: String, default: 'row' },

    // 是否自动换行
    warp: { type: Boolean, default: false },

    // 可伸缩性  [row: 行布局 | col: 列布局]
    flexibility: { type: Boolean, default: false },
    // 宽度
    // eslint-disable-next-line vue/require-default-prop
    width: String,

    // 高度
    // eslint-disable-next-line vue/require-default-prop
    height: String,

    // 头部工具栏
    headerTools: {
      type: Object,
      default() {
        return {}
      }
    },

    // 内容区 主轴上的对齐方式  flex-start | flex-end | center | space-between | space-around
    justifyContent: { type: String, default: 'flex-start' }
  },
  data() {
    return {
      isCollapsed: this.collapsed,
      iWidth: this.width
    }
  },
  computed: {
    calWidth: function() {
      return this.iWidth || this.width
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
        }
      }
    }
  }
}
</script>
