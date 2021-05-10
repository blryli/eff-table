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
    <diy-search :show.sync="show" />
  </div>
</template>

<script>
import DiySearch from 'packages/search'
console.log(DiySearch, 123)
export default {
  name: 'Search',
  inject: ['table'],
  components: {
    DiySearch
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    click() {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss">
  .eff-table__diy_search {
    width: 16px;
    height: 16px;
    cursor: pointer;

    div:nth-child(1) {
      position: relative;
      border: 2px solid #999;
      border-radius: 100%;
      width: 14px;
      height: 14px;
      box-sizing: border-box;
       animation: alternate;
    }
    &:hover{
      div:nth-child(1) {
        animation: effSearchScale 1s infinite;
        transition: all 1s;
      }
    }
    div:nth-child(2) {
      position: relative;
      border: 2px solid #999;
      border-radius: 100%;
      width: 4px;
      transform: rotate( 309deg );
      left: -4px;
      top: -2px;
    }
  }

  @keyframes effSearchScale {
  0%{
    border-width: 2px;
  }
  50% {
    border-width: 7px;
  }
  100%{
    border-width: 2px;
  }
}
</style>
