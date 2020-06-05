<template>
  <div class="table-wrapper">
    <Toolbar v-if="$slots.toolbar || fullscreen || drag && columnControl" ref="toolbar">
      <slot name="toolbar" />
    </Toolbar>
    <div ref="table" :class="tableClass">
      <!-- header -->
      <TableHeader ref="header" @dragend="handleDragend" />
      <!-- body -->
      <TableBody ref="TableBody" :data="data" />
      <!-- 左侧 fixed 投影 -->
      <div v-show="bodyOverflowX && bodyScrollLeft && leftWidth" class="eff-table__shadow-left" :style="{left: `${leftWidth - 2}px`}" />
      <!-- 右侧 fixed 投影 -->
      <div v-show="bodyOverflowX && rightWidth && !isScrollRightEnd" class="eff-table__shadow-right" :style="{right: `${rightWidth + scrollYwidth}px`}" />
    </div>
    <drag
      v-if="border && drag"
      ref="drag"
      v-model="columns"
      :column-control="columnControl"
      @cardClose="handleCardClose"
      @change="change"
    />
    <edit
      v-if="edit"
      ref="edit"
      :columns="visibleColumns"
      @columnLast="handleColumnLast"
      @rowLast="handleRowLast"
      @validate="handleValidate"
    />
    <!-- 气泡 -->
    <Popover :show="show" :reference="reference" :content="popoverSlot" />
    <div v-show="lineShow" ref="line" class="eff-table-line" />
    <p>spaceWidth {{ spaceWidth }}</p>
    <p>minWidth {{ minWidth }}</p>
    <p>bodyWidth {{ bodyWidth }}</p>
    <p>bodyOverflowX {{ bodyOverflowX }}</p>
    <p>bodyOverflowY {{ bodyOverflowY }}</p>
  </div>
</template>

<script>
import Column from 'mixins/column'
import Selection from 'mixins/selection'
import Layout from 'mixins/layout'
import validate from 'mixins/validate'
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import Popover from '../components/Popover'
import Drag from '../components/Drag'
import Toolbar from '../components/Toolbar'
import Edit from '../components/Edit'

export default {
  name: 'EffTable',
  components: {
    TableHeader,
    TableBody,
    Popover,
    Drag,
    Toolbar,
    Edit
  },
  mixins: [Column, Layout, Selection, validate],
  props: {
    value: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    border: Boolean,
    drag: Boolean,
    edit: Boolean,
    columnControl: Boolean,
    fullscreen: Boolean,
    rowHeight: { type: Number, default: 36 },
    height: { type: Number, default: 400 },
    maxHeight: { type: Number, default: 0 },
    highlightCurrentRow: Boolean,
    emptyText: { type: String, default: '暂无数据' },
    showOverflowTooltip: Boolean
  },
  data() {
    return {
      columns: this.value.map(d => {
        return { ...{ width: d.width || 0 }, ...d }
      }),
      show: false,
      popoverSlot: null,
      reference: null,
      currentRow: null,
      lineShow: false,
      isScreenfull: false
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(d => d.show !== false)
    }
  },
  watch: {
    data(val) {

    },
    value(val) {
      this.columns = val
    }
  },
  provide() {
    return {
      table: this
    }
  },
  created() {
    this.$on('screenfullChange', this.screenfullChange)
  },
  beforeDestroy() {
    this.$off('screenfullChange', this.screenfullChange)
  },
  methods: {
    screenfullChange(val) {
      this.isScreenfull = val
    },
    forceUpdate() {
      this.$refs.TableBody.forceUpdate()
    },
    handleDragend(column, width) {
      console.log({ column, width })
      const { columns } = this
      const index = columns.findIndex(d => {
        const { label = '', type = '', prop = '' } = column
        const { label: dLabel = '', type: dType = '', prop: dProp = '' } = d
        return label + type + prop === dLabel + dType + dProp
      })
      columns[index].width = width
      this.columns = [...columns]
      this.change()
      this.resize()
    },
    change() {
      this.$emit('input', this.columns)
      this.$emit('dragChange', this.columns)
    },
    handleCardClose() {
      this.$emit('dragCardClose')
    },
    handleColumnLast(placement) {
      this.$emit('editColumnLastToNext', placement)
    },
    handleRowLast(placement) {
      this.$emit('editRowLast', placement)
    },
    handleValidate(val, validators) {
      this.$emit('validate', val, validators)
    }
  }
}
</script>

<style lang="scss">
@import '../components/Edit/index.scss';

.eff-table {
  font-size: 14px;
  position: relative;
  color: #606266;
  border: 1px solid #ddd;
  box-sizing: border-box;
  overflow: hidden;
}
.nodata {
  font-size: 12px;
  line-height: 40px;
  text-align: center;
  color: #666;
}
.eff-table__shadow-left, .eff-table__shadow-right{
  position: absolute;
  top: 0;
  bottom: 17px;
  width: 1px;
}
.eff-table__shadow-left{
  box-shadow: 5px 0px 8px rgba(0, 0, 0, 0.5);
}
.eff-table__shadow-right{
  box-shadow: -5px 0px 8px rgba(0, 0, 0, 0.5);
}
</style>

<style lang="scss">
.eff-table {
  .v-cell{
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    padding: 0 5px;
  }

  [draggable="true"] {
    opacity: .5;
  }
}

/** header */
.eff-table__header-wrapper {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  background-color: #f6f7f8;
  box-sizing: border-box;
}
.eff-table__header-wrapper{
  &::-webkit-scrollbar {
    border-left: 1px solid #ddd;
  }
}
.is-overflow-y .eff-table__header-wrapper{
  overflow-y: scroll;
}
.eff-table__header, .eff-table__body-row {
  position: relative;
  width: 100%;
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
}
.eff-table__column{
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.eff-table__header{
  .eff-table__column{
    color: #666;
    font-weight: bold;
    user-select: none;
    background-color: #f6f7f8;

    &.is-draging{
      background-color: #c7daf1;
    }
    &.is-draging--warning{
      background-color: #f3caca;
    }
  }
  .header-drag-move{
    position: fixed;
    width: 8px;
    &:hover{
      cursor: col-resize;
    }
  }
  .is--space{
    cursor: no-drop;
  }
  &.is--move{
    .header-drag-move{
      &:hover{
        cursor: default;
      }
    }
    .is--space{
      cursor: default;
    }
  }
}

.eff-table__body{
  &--x-space{
    width: 100%;
    height: 1px;
    margin-bottom: -1px;
  }
  &--y-space{
    width: 0;
    float: left;
  }
}
.eff-table__body-row{
  .eff-table__column{
    background-color: #fff;
    border-bottom: 1px solid #ddd;
  }
  &.current-row .eff-table__column {
    background-color: #e8f4ff;
  }
  &:hover .eff-table__column{
    background-color: #f1f3f5;
  }
}

.is-border .eff-table__header .eff-table__column + .eff-table__column,
.is-border .eff-table__body-row .eff-table__column + .eff-table__column{
  border-left: 1px solid #ddd;
}
.is--fixed {
  position: absolute;
  top: 0;
  bottom: 0;
}

.eff-table-line{
  position: fixed;
  left: 50px;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: #ddd;
}
.is--space{
  flex: 1;
}

.empty-text{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #888;
}
</style>
