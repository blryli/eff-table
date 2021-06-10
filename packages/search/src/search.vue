<template>
  <div class="drag-table">
    <card
      v-show="show"
      title="自定义搜索"
      :init-style="cardStyle"
      :min-height="300"
      :height="300"
      :width="800"
      :min-width="400"
      @close="close"
    >
      <template slot="header">
        <div>
          <el-button type="primary" size="mini" @click="search"> 搜索 </el-button>
          <el-button type="primary" size="mini" @click="reset"> 重置 </el-button>
          <el-button type="primary" size="mini" @click="add"> 新增条件 </el-button>
        </div>
      </template>
      <div class="main">
        <div v-for="(v, k) in list" :key="k" class="item">
          <el-select v-model="v.field">
            <el-option v-for="(vv, kk) in fields" :key="kk" :value="vv">{{ vv }}</el-option>
          </el-select>
          <el-select v-model="v.op">
            <el-option v-for="(vv, kk) in op" :key="kk" :value="vv.value">{{ vv.label }}</el-option>
          </el-select>
          <el-input v-model="v.value" />
          <el-button type="danger" size="mini" @click="search"> 删除 </el-button>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
import Card from 'pk/card'
import { deepClone } from 'pk/utils/index'

export default {
  name: 'DiySearch',
  components: { Card },
  props: {
    show: {}
  },
  dragToEl: {},
  data() {
    return {
      list: [],
      cardStyle: {},
      op: this.table.toolbarConfig.diySearch.op,
      fields: this.table.toolbarConfig.diySearch.fields
    }
  },
  inject: ['table'],
  computed: {
  },
  watch: {
  },
  mounted() {
    setTimeout(v => {
      const { offsetHeight, clientWidth, offsetLeft, offsetTop } = this.table.$el
      this.cardStyle = {
        bottom: 0,
        right: 0,
        width: clientWidth - 40,
        height: offsetHeight < 300 ? 300 : offsetHeight
      }
    }, 1000)
  },
  beforeDestroy() {

  },
  methods: {
    search() {
    },
    add() {
      this.list.push({
        op: this.op[0].value,
        field: this.fields[0],
        value: ''
      })
    },
    close() {
      this.$emit('update:show')
    },
    reset() {
      this.$emit('update:show')
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  width: 100%;
  padding: 0;
  height: 100%;
  border: unset;
  flex-direction: column;
  align-items: center;
  .item {
    margin-bottom: 10px;
    display: flex;
    ::v-deep.el-select {
      margin-right: 10px;
    }
    ::v-deep.el-input {
      margin-right: 10px;
    }
  }
}

</style>
