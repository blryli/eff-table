<template>
  <code>{{ code }}</code>
</template>

<script>
import hljs from 'highlight.js'

export default {
  name: 'CodeSnippet',
  props: {
    code: { type: String, default: '' }
  },
  mounted() {
    const block = this.$el
    hljs.highlightBlock(block)
  }

}
</script>

<style lang="scss">
.hljs {
  border-radius: 3px;
  font-size: 10pt;
  border: solid 1px $md-grey-100;
  white-space: pre;
}
</style>
