<template>
  <card
    :show="show"
    title="列批量控制"
    :min-height="300"
    :height="300"
    :width="800"
    :min-width="400"
    :title-suffix="{message: '单击切换列显示/隐藏，拖动调整列顺序'}"
    @close="close"
  >
    <template slot="footer">
      <el-button size="mini" @click="resetColumns">还原</el-button>
      <el-button type="primary" size="mini" @click="save">保存</el-button>
    </template>
  </card>
</template>

<script>
import Card from 'pk/card'
import XEUtils from 'xe-utils'
export default {
  name: 'ColumnManage',
  components: { Card },
  props: {
    value: { type: Array, default: () => ([]) },
    disabled: Boolean
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    columns: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    toggleCardShow(e) {
      this.show = !this.show
    },
    close() {
      this.show = false
      this.$emit('cardClose')
    },
    resetColumns() {
      this.columns = XEUtils.clone(this.value, true)
    },
    save() {
      this.$emit('input', this.columns)
      this.close()
      this.table.doLayout()
    }
  }
}
</script>
