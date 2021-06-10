<script>
import PopoverRef from 'pk/popover/src/popover-ref'
import Icon from 'pk/icon'

export default {
  name: 'PrefixSuffix',
  props: {
    tag: { type: String, default: 'div' },
    prefix: { type: Object, default: () => ({}) },
    suffix: { type: Object, default: () => ({}) }
  },
  render(h) {
    const { tag, prefix, suffix } = this
    if (!prefix.message && !suffix.message) return h(tag, {}, this.$slots.default)
    return h(tag, { class: 'eff-prefix-suffix' }, [
      prefix.message ? <PopoverRef
        class='eff-prefix'
        effect='dark'
        message={prefix.message}
      >
        <Icon icon={prefix.icon || 'question'} />
      </PopoverRef> : '',
      this.$slots.default,
      suffix.message ? <PopoverRef
        class='eff-suffix'
        effect='dark'
        message={suffix.message}
      >
        <Icon icon={suffix.icon || 'question'} />
      </PopoverRef> : ''
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
