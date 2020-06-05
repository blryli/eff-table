<template>
  <div class="drag-table">
    <card
      v-if="columnControl"
      :show="show"
      title="列控制"
      @close="close"
    >
      <div v-for="(d, i) in hiddenColumns" :key="i">{{ d.label }}</div>
    </card>
  </div>
</template>

<script>
import Sortable from './sortable'
import Card from './card'
import { addClass, removeClass, hasClass } from 'utils/dom'

export default {
  name: 'TableDrag',
  components: { Card },
  props: {
    value: { type: Array, default: () => [] },
    columnControl: Boolean
  },
  data() {
    return {
      columns: this.value,
      sortable: null,
      show: false,
      dradingTarget: null
    }
  },
  computed: {
    hiddenColumns() {
      return this.columns.filter(d => d.show === false)
    }
  },
  watch: {
    value(val) {
      this.columns = val
    },
    dradingTarget(val, oldVal) {
      if (val !== oldVal) {
        const classes = target =>
          hasClass(target, 'is-drag--filter')
            ? 'is-draging--warning'
            : 'is-draging'
        addClass(val, classes(val))
        removeClass(oldVal, classes(oldVal))
      }
    }
  },
  mounted() {
    this.$parent.$on('header-dragend', this.elDragendChange)

    this.$nextTick(() => {
      this.sortable = new Sortable({
        el: this.$parent.$el.querySelector('.eff-table__header'),
        group: 'table',
        filter: 'is-drag--filter',
        dragImage: {
          height: 30
        },
        drag: this.handleDrag,
        dragstart: this.handleDragstart,
        dragend: this.handleDragend,
        dragenter: this.handleDragenter,
        onEnd: this.handleEnd
      })
      if (this.columnControl) {
        setTimeout(() => {
          this.cradsSortable = new Sortable({
            el: this.$el.querySelector('.drag-card__body'),
            group: 'table',
            dragImage: {
              height: 30
            },
            drag: this.handleDrag,
            dragstart: this.handleDragstart,
            dragend: this.handleDragend,
            dragenter: this.handleDragenter,
            onEnd: this.handleEnd
          })
        }, 500)
      }
    })
  },
  beforeDestroy() {
    this.sortable = null
    this.cradsSortable = null
    this.$parent.$off('header-dragend', this.elDragendChange)
  },
  methods: {
    close() {
      this.show = false
      this.$emit('cardClose')
    },
    toggleCardShow(val) {
      this.show = val === undefined ? !this.show : val
    },
    elDragendChange(newWidth, oldWidth, column, event) {
      const index = this.columns.findIndex(d => d.label === column.label)
      if (index > -1) {
        this.columns[index].width = newWidth

        this.$emit('change', this.columns)
      }
    },
    handleDrag({ enterTo }) {},
    handleDragstart() {},
    handleDragend(target) {
      removeClass(this.dradingTarget, 'is-draging')
      this.dradingTarget = null
    },
    isHeadNode(target) {
      return hasClass(target, 'eff-table__header')
    },
    handleDragenter({ from, to, fromEl, toEl, willInsertAfter }) {
      // console.log({ from, to, fromEl, toEl, willInsertAfter })
      // tr内元素拖动
      if (this.isHeadNode(from) && this.isHeadNode(to)) {
        this.dradingTarget = toEl
        if (toEl === fromEl) {
          this.dradingTarget = null
        }
      }

      // tr移出元素
      if (this.isHeadNode(from) && to.classList.contains('drag-card__body')) {
        this.dradingTarget = toEl
      }

      // 元素移入tr
      if (this.isHeadNode(to) && from.classList.contains('drag-card__body')) {
        this.dradingTarget = toEl
      }
    },
    handleEnd({ fromIndex, toIndex, from, to, fromEl, toEl }) {
      this.dradingTarget = null
      const columns = [...this.columns]
      console.log({ fromIndex, toIndex, from, to, fromEl, toEl })

      const some = (column, el) =>
        column.label && column.label.trim() === el.innerText.trim()
      const oldIndex = columns.findIndex(d => some(d, fromEl))
      if (oldIndex < 0) { return console.error(`没有找到label为 ${fromEl.innerText} 的节点`) }

      if (hasClass(toEl, 'is-drag--filter')) {
        this.$info('不能放入固定的列！')
        return
      }

      // tr内元素拖动
      if (this.isHeadNode(from) && this.isHeadNode(to) && fromEl !== toEl) {
        const oldItem = columns[oldIndex]
        columns.splice(oldIndex, 1)
        if (hasClass(toEl, 'is--space')) {
          columns.push(oldItem)
        } else {
          let newIndex = columns.findIndex(d => some(d, toEl))
          if (toIndex > fromIndex) {
            newIndex += 1
          }
          columns.splice(newIndex, 0, oldItem)
        }
      }

      // tr移出元素
      if (this.isHeadNode(from) && to.classList.contains('drag-card__body')) {
        columns[oldIndex].show = false
      }

      // 元素移入tr
      if (this.isHeadNode(to) && from.classList.contains('drag-card__body')) {
        if (oldIndex > -1) {
          const oldItem = columns[oldIndex]
          oldItem.show = true
          columns.splice(oldIndex, 1)
          if (hasClass(toEl, 'is--space')) {
            columns.push(oldItem)
          } else {
            const newIndex = columns.findIndex(d => some(d, toEl))
            columns.splice(newIndex, 0, oldItem)
          }
        }
      }

      this.columns = [...columns]
      // console.log(JSON.stringify(columns, null, 2))

      this.$emit('input', this.columns)
      this.$emit('change', this.columns)
    }
  }
}
</script>
