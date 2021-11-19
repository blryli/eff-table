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
  mounted() {
    Object.assign(this, {
      popover: this.$refs.popover,
      editPopover: this.$refs.editPopover,
      validPopover: this.$refs.validPopover,
      validingPopover: this.$refs.validingPopover
    })
  },
  methods: {
    tipShow(opts) {
      if (!this.popover) this.popover = this.$refs.popover
      this.popover.doShow()
      this.popoverOpts = opts
    },
    tipClose() {
      this.popover.doHide()
    },
    editTipShow(opts) {
      if (!this.editPopover) this.editPopover = this.$refs.editPopover
      this.editPopover.doShow()
      this.editPopoverOpts = opts
      this.table.setEditStop(true)
    },
    editTipClose() {
      this.editPopover.doHide()
      this.table.setEditStop(false)
      // this.editPopoverOpts = null
    },
    validTipShow(opts) {
      if (!this.validPopover) this.validPopover = this.$refs.validPopover
      this.validPopover.doShow()
      this.validPopoverOpts = opts
    },
    validTipClose() {
      this.validPopover.doHide()
    },
    validingTipShow(opts) {
      if (!this.validingPopover) this.validingPopover = this.$refs.validingPopover
      this.validingPopover.doShow()
      this.validingPopoverOpts = opts
    },
    validingTipClose() {
      this.validingPopover.doHide()
    }
  }
}
</script>
