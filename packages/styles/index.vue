<script>
export default {
  name: 'Styles',
  render(h) {
    return ''
  }
}
</script>
<style lang="scss">
@import './imports.scss';
.is-overflow--y {
  &.eff-table__header-wrapper,
  &.eff-table__body-wrapper,
  &.eff-table__footer{
    overflow-y: scroll;
  }
  &.eff-table__header-wrapper{
    &::-webkit-scrollbar {
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
    }
  }
  &.eff-table__footer{
    &::-webkit-scrollbar {
      border-left: 1px solid #ddd;
    }
  }
}
.eff-table__fixed-left .is-overflow--y {
  &.eff-table__header-wrapper,
  &.eff-table__body-wrapper,
  &.eff-table__footer{
    overflow-y: hidden;
  }
}
.is-overflow--x{
  &.eff-table__body-wrapper{
    overflow-x: scroll;
  }
}
.is--stripe{
  .eff-table__body-row:nth-child(even){
    &.is--hover{
      .eff-table__column {
        background-color: #f1f3f5;
      }
    }
  }
  .eff-table__body-row:nth-child(even){
    .eff-table__column {
      background-color: #fafafa;
    }
  }
}

.is--border:not(.is--start) {
  border-left: 1px solid #ddd;
}
.eff-table__fixed-right {
  .is--border.is--start{
    border-left: 1px solid transparent;
  }
  &.is-scroll--end{
    .is--border.is--start{
      border-left-color: #ddd;
    }
  }
}
.eff-table__expanded{
  background-clip: content-box;
}

</style>
