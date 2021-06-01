<template>
  <transition name="search-fade">
    <div
      v-show="visible"
      class="search-wrapper"
    >
      <div
        role="search"
        :key="key"
        class="custom-search"
        ref="customSearch"
      >
        <div class="search-header">
          <span class="search-title">自定义搜索</span>
          <button
            type="button"
            class="search-headerbtn"
            aria-label="Close"
            @click="handleClose"
          >
            <i class="search-close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="search-body">
          <el-table
            :data="searchData"
            border
            row-key="fieldName"
            default-expand-all
            :tree-props="{children: 'childConditionList'}"
            style="width: 100%">
            <el-table-column
              prop="fieldName"
              label="字段名称">
            </el-table-column>
            <el-table-column
              prop="operator"
              label="操作符"
              align="center">
              <template slot-scope="props">
                <el-select v-model="props.row.operator">
                  <el-option
                    v-for="item in props.row.operateTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="conditionConnector"
              label="条件连接符"
              align="center">
              <template slot-scope="props">
                <el-select v-model="props.row.conditionConnector">
                  <el-option label="and" value="and"></el-option>
                  <el-option label="or" value="or"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="fieldValue"
              label="字段值"
              width="200"
              align="center">
              <template slot-scope="scope" v-if="!scope.row.childConditionList">
                <el-select v-if="scope.row.componentType == 'select' && scope.row.dataSourceType == '1'" v-model="scope.row.fieldValue">
                  <el-option
                    v-for="item in scope.row.staticSourceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-else-if="scope.row.componentType == 'select' && scope.row.dataSourceType == '2'" 
                v-model="scope.row.fieldValue" 
                remote 
                @focus="getOptions(scope.row, scope.$index)">
                  <el-option
                    v-for="item in scope.row.staticSourceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

                <el-input v-else v-model="scope.row.fieldValue"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="search-footer">
          <el-button size="mini">重置</el-button>
          <el-button size="mini" @click="handleSearch" type="primary">搜索</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "CustomSearch",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    searchData: {
      type: Array,
      default: ()=> new Array()
    }
  },
  data() {
    return {
      key: 0,
      // searchData: [
      //   {
      //     fieldName: "姓名",
      //     operator: "",
      //     fieldValue: "",
      //     conditionConnector: "",
      //     fieldType: "",
      //     componentType: "select",
      //     dataSourceType: "1",
      //     apiSource: {
      //       apiUcode: ""
      //     },
      //     staticSourceList: [
      //       {
      //         label: "aaa",
      //         value: "aaa"
      //       },
      //       {
      //         label: "bbb",
      //         value: "bbb"
      //       }
      //     ]
      //     // childConditionList: [
      //     //   {
      //     //     fieldName: "状态",
      //     //     operator: "",
      //     //     fieldValue: "",
      //     //     conditionConnector: ""
      //     //   },
      //     //   {
      //     //     fieldName: "类型",
      //     //     operator: "",
      //     //     fieldValue: "",
      //     //     conditionConnector: ""
      //     //   },
      //     // ]
      //   },
      //   {
      //     fieldName: "公司",
      //     operator: "",
      //     fieldValue: "",
      //     conditionConnector: "",
      //     operateTypeList: [
      //       {
      //         label: "小于",
      //         value: "<",
      //       },
      //       {
      //         label: "等于",
      //         value: "=",
      //       },
      //       {
      //         label: "大于",
      //         value: ">",
      //       },
      //       {
      //         label: "包含",
      //         value: "in",
      //       },
      //     ],
      //     fieldType: "",
      //     componentType: "select",
      //     dataSourceType: "2",
      //     apiSource: {
      //       apiUcode: "acadc"
      //     },
      //     staticSourceList: []
      //   },
      //   {
      //     fieldName: "编号",
      //     operator: "",
      //     fieldValue: "",
      //     conditionConnector: "",
      //     operateTypeList: [
      //       {
      //         label: "小于",
      //         value: "<",
      //       },
      //       {
      //         label: "等于",
      //         value: "=",
      //       },
      //       {
      //         label: "大于",
      //         value: ">",
      //       },
      //       {
      //         label: "包含",
      //         value: "in",
      //       },
      //     ],
      //     fieldType: "",
      //     componentType: "",
      //     dataSourceType: "",
      //     apiSource: {},
      //     staticSourceList: []
      //   },
      // ]
    };
  },

  watch: {
    visible(val) {
      if (val) {
        document.body.appendChild(this.$el);
      } else {
        this.$nextTick(() => {
          this.key++;
        });
      }
    }
  },
  mounted() {
    if (this.visible) {
      document.body.appendChild(this.$el);
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    handleSearch() {
      this.$emit('search', this.searchData)
    },
    getOptions(row,index) {
      console.log(index)
      setTimeout(() => {
        this.searchData[index]["staticSourceList"] = [
          {
            label: "ccc",
            value: "ccc"
          },
          {
            label: "ddd",
            value: "ddd"
          }
        ]
        this.$emit('select-remote', row)
      },200)
    }
  }
};
</script>
<style lang="scss">
@import '../../styles/search.scss';
</style>

