<template>
  <div class="eff-table__popovers">
    <Popover ref="popover" v-bind="popoverOpts" />
    <Popover v-if="table.edit" ref="editPopover" v-bind="editPopoverOpts" />
    <Popover ref="validPopover" v-bind="validPopoverOpts" />
    <Popover v-if="table.edit" ref="validingPopover" v-bind="validingPopoverOpts" />
  </div>
</template>

<script>
import Popover from 'pk/popover'

export default {
  name: 'Popovers',
  components: { Popover },
  inject: ['table'],
  data() {
    return {
      popoverOpts: {},
      editPopoverOpts: {},
      validingPopoverOpts: {},
      validPopoverOpts: {}
    }
  },
  methods: {
    tipShow(opts) {
      this.$refs.popover.doShow()
      this.popoverOpts = opts
    },
    tipClose() {
      this.$refs.popover.doHide()
    },
    editTipShow(opts) {
      this.$refs.editPopover.doShow()
      this.editPopoverOpts = opts
    },
    editTipClose() {
      this.$refs.editPopover.doHide()
    },
    validTipShow(opts) {
      this.$refs.validPopover.doShow()
      this.validPopoverOpts = opts
    },
    validTipClose() {
      this.$refs.validPopover.doHide()
    },
    validingTipShow(opts) {
      this.$refs.validingPopover.doShow()
      this.validingPopoverOpts = opts
    },
    validingTipClose() {
      this.$refs.validingPopover.doHide()
    }
  }
}
</script>
