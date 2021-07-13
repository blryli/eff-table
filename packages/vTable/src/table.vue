<template>
  <div class="v-table">
    <div class="flex-row v-table-header">
      <slot v-if="showHeader" name="header" />
      <span class="flex-grow" />

      <el-popover
        placement="bottom-start"
        title="自定义视图"
        width="220"
        trigger="click"
        popper-class="table-search-popper"
      >
        <el-button v-show="dynamicCol" slot="reference" icon="p-icon-shitu" size="mini" type="text">
          自定义视图
        </el-button>
        <el-scrollbar style="height:300px">
          <draggable
            v-model="columns"
            ghost-class="ghost"
            :animation="340"
            @sort="saveColumns"
          >
            <div v-for="(col) in columns" :key="col.prop" class="col-item flex-row ">

              <span class="item-name">
                <i class="p-icon-drag" />
                {{ $t(col.label) }}
              </span>
              <span class="flex-grow" />
              <span class="item-checked">
                <el-checkbox v-model="col.show" />
                <span style="padding-left:5px">显示</span>
              </span>
            </div>
          </draggable>
        </el-scrollbar>
        <div class="btns">
          <el-button type="text" icon="el-icon-refresh-left" size="mini" @click="resetColumns">恢复默认</el-button>
          <!-- <el-button type="text" icon="el-icon-check" size="mini" @click="saveColumns">确定</el-button> -->
        </div>
      </el-popover>
      <span style="width:20px" />
      <el-popover
        placement="bottom"
        title="数据筛选"
        width="400"
        trigger="click"
        popper-class="table-search-popper"
      >
        <el-button v-show="dynamicSearch" slot="reference" icon="p-icon-search" size="mini" type="text">
          数据筛选
        </el-button>
        <div class="">
          <slot ref="form" name="search" />
          <div style="text-align:right; border-top:1px solid #eee;padding-top:15px">
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="search">查询</el-button>
          </div>
        </div>
      </el-popover>
    </div>
    <slot />
    <div v-if="hasPagination" class="v-table-footer">
      <el-pagination
        class="p-el-pagination"
        layout="sizes,next,pager,prev,jumper,total"
        :page-sizes="[10, 20, 30, 50, 100]"
        :current-page="pagination.pageNum"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @size-change="sizeChange"
        @current-change="pageChange"
        @prev-click="pageChange"
        @next-click="pageChange"
      />
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  // 页面布局容器组件
  name: 'VTable',
  components: { draggable },
  props: {
    id: { type: String, default: '' },
    // 标题
    title: { type: String, default: '' },
    // 头部工具栏是否显示
    showHeader: { type: Boolean, default: true },

    // 动态列头控制功能
    dynamicCol: { type: Boolean, default: false },

    // 动态列头控制功能
    columns: {
      type: Array,
      default() {
        return null
      }
    },

    // 动态搜索功能
    dynamicSearch: { type: Boolean, default: false },
    // 是否显示分页组件
    hasPagination: { type: Boolean, default: false },
    // 是否显示分页组件
    pagination: {
      type: Object,
      default() {
        return { pageNum: 1, pageSize: 10, total: 0 }
      }
    }
  },
  data() {
    return {
      cols: []
    }
  },
  created() {
    // 应用个性化列视图,并保存原始列视图
    if (this.id && this.dynamicCol && this.columns) {
      this.cols = JSON.parse(JSON.stringify(this.columns))
      const json = localStorage.getItem(this.id)
      const columns = json ? JSON.parse(json) : null
      if (columns) {
        // 判断列配置是否有变动,如果没有变动则应用个性化配置
        const arr1 = columns.map(col => col.prop || '')
        const arr2 = this.cols.map(col => col.prop || '')
        if (arr1.sort().toString() === arr2.sort().toString()) {
          this.columns = columns
          this.$emit('update:columns', columns)
        }
      }
    }
  },
  methods: {
    sizeChange(val) {
      this.pagination.pageSize = val
      this.$emit('update:pagination', this.pagination)
      this.$emit('search', {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum
      })
    },
    pageChange(val) {
      this.pagination.pageNum = val
      this.$emit('update:pagination', this.pagination)
      this.$emit('search', {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum
      })
    },
    saveColumns() {
      this.$emit('update:columns', [...this.columns])
      localStorage.setItem(this.id, JSON.stringify(this.columns))
    },
    resetColumns() {
      this.$emit('update:columns', this.cols)
      localStorage.setItem(this.id, '')
    },
    reset() {
      this.$slots.search[0].componentInstance.resetFields()
      this.search()
    },
    search() {
      const params = {
        pageSize: this.pagination.pageSize,
        pageNum: 1
      }
      this.$emit('search', params)
    }
  }
}
</script>
<style lang="scss" scoped>

.v-table-header{
  padding:10px 5px ;
}
.col-item{
  line-height: 30px;
  font-size: 13px;
  padding-right:30px;
  i{
    font-size: 11px;
    color:#ccc;
    padding:0 5px;
    cursor: move;
  }
}
.scrollbar-wrapper {
  max-height: 200px;
  overflow-x: hidden !important;
  .el-scrollbar__wrap{
    overflow-x: hidden !important;
  }
}
.btns{
  border-top:1px solid #eee;
   text-align:right;
   margin-top:15px;
   padding-top:10px;
}
.v-table-footer{
  padding:8px 0;
  text-align:right
}

</style>
<style lang="scss">
.table-search-popper div.el-popover__title{
 font-size: 14px !important;
}
</style>
