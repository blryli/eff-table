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
.eff-icon--delete{
  display: inline-block;
  width: 14px;
  height: 14px;
  color: #888;
  &-top{
    position: relative;
    display: block;
    width: 14px;
    height: 2px;
    margin-top: 4px;
    background-color: currentColor;
    box-sizing: border-box;
    &::before{
      content: '';
      position: absolute;
      left: 4px;
      top: -2px;
      width: 6px;
      height: 3px;
      border: 2px solid currentColor;
      border-bottom: 0;
      box-sizing: border-box;
    }
  }
  &-bottom{
    display: block;
    width: 11px;
    height: 9px;
    position: relative;
    margin: 0 auto;
    border: 2px solid currentColor;
    border-top: 0;
    border-radius: 0 0 1px 1px;
    box-sizing: border-box;
    &::before{
      content: '';
      position: absolute;
      left: 2px;
      top: 1px;
      width: 4px;
      height: 5px;
      border-left: 2px solid currentColor;
      border-right: 2px solid currentColor;
      box-sizing: border-box;
    }
  }
}
.eff-table--expand{
  height: 100%;
  display: flex;
  align-items: center;
}
.eff-card__header{
  background-color: #f6f7f8;
}
</style>
