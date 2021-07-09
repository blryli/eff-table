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
.eff-contextmenu--list{
  position: fixed;
  width: 120px;
  padding: 5px 0;
  border: 1px solid #ddd;
  background-color: white;
  user-select: none;
  z-index: 20;
  box-shadow: 0 1px 10px rgba($color: #000000, $alpha: .2);
  &-item{
    cursor: default;
    padding: 5px 10px;
    &:hover{
      background-color: #eee;
    }
  }
}
</style>
