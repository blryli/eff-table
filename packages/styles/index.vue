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
.eff-table--expand-handle{
  width: 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  cursor: pointer;
}
.eff-icon-filter{
  position: relative;
  width: 14px;
  height: 14px;
  color: #bcbdbe;
  &:hover{
    cursor: pointer;
    color: #666;
  }
  &::before{
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    display: inline-block;
    border: 7px solid currentColor;
    border-color: currentColor transparent transparent transparent;
  }
  &::after{
    content: '';
    position: absolute;
    bottom: 1px;
    left: 6px;
    display: inline-block;
    width: 2px;
    height: 8px;
    background-color: currentColor;
  }
}

</style>
