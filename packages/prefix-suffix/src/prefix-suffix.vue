<script>
import Help from 'pk/help'
import Icon from 'pk/icon'
import XEUtils from 'xe-utils'

export default {
  name: 'PrefixSuffix',
  props: {
    tag: { type: String, default: 'div' },
    prefix: { type: [Object, Function], default: () => ({}) },
    suffix: { type: Object, default: () => ({}) }
  },
  render(h) {
    const { tag, prefix, suffix } = this
    return h(tag, { class: 'eff-prefix-suffix' }, [
      XEUtils.isFunction(prefix) ? prefix() : prefix.message ? <Help
        class='eff-prefix'
        effect='dark'
        message={prefix.message}
      >
        <Icon icon={prefix.icon || 'question'} />
      </Help> : '',
      this.$slots.default,
      XEUtils.isFunction(suffix) ? suffix() : suffix.message ? <Help
        class='eff-suffix'
        effect='dark'
        message={suffix.message}
      >
        <Icon icon={suffix.icon || 'question'} />
      </Help> : ''
    ])
  }
}
</script>

<style lang="scss">
.eff-prefix-suffix{
  display: inline-block
}
.eff-prefix{
  margin-right: 3px;
  vertical-align: middle;
}
.eff-suffix{
  margin-left: 3px;
  vertical-align: middle;
}
</style>
