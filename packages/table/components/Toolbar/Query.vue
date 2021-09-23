<template>
  <div>
    <div
      class="eff-table__diy_search"
      title="搜索"
      @click="click"
    >
      <div />
      <div />
    </div>
    <SeniorQuery ref="seniorQuery" :field-list="fieldList" @change="change" />
  </div>
</template>

<script>
import SeniorQuery from 'packages/senior-query'
export default {
  name: 'Query',
  inject: ['table'],
  components: {
    SeniorQuery
  },
  data() {
    return {
      show: false,
      fieldList: []
    }
  },
  created() {
    const { seniorQueryConfig = {}} = this.table
    const { fieldList } = seniorQueryConfig
    this.fieldList = fieldList
  },
  methods: {
    click() {
      this.$refs.seniorQuery.open()
    },
    change(tableData) {
      this.table.seniorQuery = tableData
      this.table.commitProxy('query')
    }
  }
}
</script>

<style lang="scss">
  .eff-table__diy_search {
    width: 16px;
    height: 16px;
    cursor: pointer;
    overflow: hidden;

    div:nth-child(1) {
      position: relative;
      left: 2px;
      border: 2px solid #999;
      border-radius: 100%;
      width: 14px;
      height: 14px;
      box-sizing: border-box;
      animation: alternate;
      display: flex;
      align-items: center;
      justify-content: center;
      &::before{
          content: '';
          border-radius: 50%;
          display: inline-block;
          overflow: hidden;
          width: 3px;
          height: 3px;
          background-color: #fff;
        }
    }
    div:nth-child(2) {
      position: relative;
      background-color: #999;
      border-radius: 100%;
      width: 4px;
      height: 2px;
      transform: rotate( -45deg );
      left: 0;
      top: -2px;
    }
    &:hover{
      div:nth-child(1){
        background-color: #ddd;
        &::before{
          animation: effSearchScale 1s infinite;
        }
      }
    }
  }

  @keyframes effSearchScale {
  0%{
    width: 3px;
    height: 3px;
  }
  50% {
    width: 10px;
    height: 10px;
  }
  100%{
    width: 3px;
    height: 3px;
  }
}
</style>
