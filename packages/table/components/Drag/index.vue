<template>
  <div class="drag-table">
    <card v-if="columnControl" :show="show" title="列控制" @close="close">
      <div v-for="(d, i) in hiddenColumns" :key="i">{{ d.title }}</div>
    </card>
  </div>
</template>

<script>
import Sortable from 'pk/utils/sortable'
import Card from 'pk/card'
import { addClass, removeClass, hasClass } from 'pk/utils/dom'

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
  inject: ['table'],
  mounted() {
    this.$watch('table.overflowX', (newVal, oldVal) => {
      if (!oldVal && newVal) {
        this.setRowHandle(true)
      }
    })

    this.$nextTick(() => {
      const { drag, $el } = this.table
      const {
        handleDragend,
        handleDragenter,
        handleEnd,
        columnControl,
        $el: cardEl
      } = this
      const id = Math.floor(Math.random() * 100000)
      if (drag) {
        this.columnSortable = new Sortable({
          el: $el.querySelector('.eff-table__header'),
          group: id,
          filter: 'is-drag--filter',
          dragImage: {
            height: 30
          },
          dragend: handleDragend,
          dragenter: handleDragenter,
          onEnd: handleEnd
        })

        this.setRowHandle(false)
      }
      if (columnControl) {
        setTimeout(() => {
          this.cradsSortable = new Sortable({
            el: cardEl.querySelector('.eff-card__body'),
            group: id,
            dragImage: {
              height: 30
            },
            dragend: handleDragend,
            dragenter: handleDragenter,
            onEnd: handleEnd
          })
        }, 500)
      }
    })
  },
  beforeDestroy() {
    this.columnSortable = null
    this.cradsSortable = null
  },
  methods: {
    close() {
      this.show = false
      this.$emit('cardClose')
    },
    setRowHandle(left = false) {
      console.log(left, 123)
      if (this.table.rowDrag) {
        const body = left ? this.table.$refs.leftBody : this.table.$refs.body
        console.log(body, 123)
        this.rowSortable = new Sortable({
          el: body.$el.querySelector('.eff-table__body'),
          filter: 'is-drag--filter',
          dragImage: {
            height: 30
          },
          onEnd: this.handleRowEnd
        })
      }
    },
    toggleCardShow(val) {
      val = true
      this.show = val === undefined ? !this.show : val
    },
    handleRowEnd({ fromEl, toEl }) {
      const fromRowId = fromEl.getAttribute('data-rowid')
      const toRowId = toEl.getAttribute('data-rowid')
      this.$emit('row-change', +fromRowId - 1, +toRowId - 1)
    },
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
      if (this.isHeadNode(from) && to.classList.contains('eff-card__body')) {
        this.dradingTarget = toEl
      }

      // 元素移入tr
      if (this.isHeadNode(to) && from.classList.contains('eff-card__body')) {
        this.dradingTarget = toEl
      }
    },
    handleEnd({ fromIndex, toIndex, from, to, fromEl, toEl }) {
      this.dradingTarget = null
      const columns = [...this.columns]
      // console.log({ fromIndex, toIndex, from, to, fromEl, toEl })

      const some = (column, el) => {
        const { innerText } = hasClass(el, 'eff-table__header-group')
          ? el.querySelector('.eff-table__header-group-title')
          : el
        return column.title && column.title.trim() === innerText.trim()
      }
      const oldIndex = columns.findIndex(d => some(d, fromEl))
      if (oldIndex < 0) {
        return console.error(`没有找到title为 ${fromEl.innerText} 的节点`)
      }

      if (hasClass(toEl, 'is-drag--filter')) {
        console.log('该列不能做拖动操作！')
        return
      }
      // tr内元素拖动
      if (this.isHeadNode(from) && this.isHeadNode(to) && fromEl !== toEl) {
        const oldItem = columns[oldIndex]
        columns.splice(oldIndex, 1)
        if (hasClass(toEl, 'is--space')) {
          const index = columns.findIndex(d => d.fixed === 'right')
          index > -1 ? columns.splice(index, 0, oldItem) : columns.push(oldItem)
        } else {
          let newIndex = columns.findIndex(d => some(d, toEl))
          if (toIndex > fromIndex) {
            newIndex += 1
          }
          columns.splice(newIndex, 0, oldItem)
        }
      }

      // tr移出元素
      if (this.isHeadNode(from) && to.classList.contains('eff-card__body')) {
        columns[oldIndex].show = false
      }

      // 元素移入tr
      if (this.isHeadNode(to) && from.classList.contains('eff-card__body')) {
        if (oldIndex > -1) {
          const oldItem = columns[oldIndex]
          oldItem.show = true
          columns.splice(oldIndex, 1)
          if (hasClass(toEl, 'is--space')) {
            const index = columns.findIndex(d => d.fixed === 'right')
            index > -1
              ? columns.splice(index, 0, oldItem)
              : columns.push(oldItem)
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
