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
// arrow
@mixin eff-icon-arrow{
  position: relative;
  display: inline-block;
  width: 15px;
  height: 12px;
  text-align: center;
  vertical-align: middle;
  box-sizing: border-box;
  &::before{
    position: absolute;
    width: 5px;
    height: 5px;
    content: "";
    display: inline-block;
    border: 1px solid currentColor;
    transform: rotate(-45deg);
  }
}
.eff-icon-arrow-left{
  @include eff-icon-arrow;
  &:before{
    left: 3px;
    top: 1px;
    border-color: currentColor transparent transparent currentColor;
  }
}
.eff-icon-arrow-right{
  @include eff-icon-arrow;
  &:before{
    left: 0;
    top: 1px;
    border-color: transparent currentColor currentColor transparent;
  }
}
.eff-icon-arrow-top{
  @include eff-icon-arrow;
  &:before{
    left: 1px;
    top: 3px;
    border-color: currentColor currentColor transparent transparent;
  }
}
.eff-icon-arrow-bottom{
  @include eff-icon-arrow;
  &:before{
    left: 1px;
    top: 0;
    border-color: transparent transparent currentColor currentColor;
  }
}

// caret
@mixin eff-icon-caret{
  position: relative;
  display: inline-block;
  width: 13px;
  height: 12px;
  text-align: center;
  vertical-align: middle;
  box-sizing: border-box;
  &::before{
    position: absolute;
    content: "";
    display: inline-block;
    border: 5px solid #333;
    opacity: .8;
  }
  &:hover{
    &::before{
      opacity: 1;
    }
  }
}
.eff-icon-caret-left{
  @include eff-icon-caret;
  &:before{
    left: -3px;
    top: 1px;
    border-color: transparent currentColor transparent transparent;
  }
}
.eff-icon-caret-right{
  @include eff-icon-caret;
  &:before{
    left: 3px;
    top: 1px;
    border-color: transparent transparent transparent currentColor;
  }
}
.eff-icon-caret-top{
  @include eff-icon-caret;
  &:before{
    left: 0;
    top: -3px;
    border-color: transparent transparent currentColor transparent;
  }
}
.eff-icon-caret-bottom{
  @include eff-icon-caret;
  &:before{
    left: 0;
    top: 3px;
    border-color: currentColor transparent transparent transparent;
  }
}
</style>
