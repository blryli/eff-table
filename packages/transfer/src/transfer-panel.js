import VCheckbox from 'pk/checkbox'
import XEUtils from 'xe-utils'
import { on, off } from 'pk/utils/dom'
import Popover from 'pk/popover'

export default {
  name: 'EffTransferPanel',
  components: { VCheckbox, Popover },
  props: {
    value: { type: Array, default: () => ([]) },
    data: { type: Array, default: () => ([]) },
    ids: { type: Array, default: () => ([]) },
    defaultCheckedKeys: { type: Array, default: () => ([]) },
    defaultExpandedKeys: { type: Array, default: () => ([]) },
    title: { type: String, default: '列表' },
    panel: { type: String, default: '' },
    props: { type: Object, default: () => ({}) },
    lazy: Boolean,
    loadMethod: { type: Function, default: () => {} },
    transferDataStore: { type: Object, default: () => ({}) },
    expandedAll: Boolean
  },
  provide() {
    return { transferPanel: this }
  },
  data() {
    return {
      dataStore: {},
      selectionAll: false,
      indeterminate: false,
      bodyHeight: 0,
      startIndex: 0,
      expandeds: {},
      popoverOpts: {},
      panelWidth: 0
    }
  },
  computed: {
    selecteds() {
      return Object.values(this.dataStore).reduce((acc, cur) => cur.checked ? acc.concat(cur.id) : acc, [])
    },
    checkeds() {
      const { dataStore, selecteds } = this
      return selecteds.map(id => {
        const mapId = dataStore[id]
        if (!mapId) {
          console.warn(id + ' 不存在于transfer')
        }
        return mapId
      }).filter(d => d)
    },
    renderNode() {
      const { data, ids, props, lazy, selecteds, panelId, panelWidth, isIndeterminate, rowSelectionChange, isDisabled, handleExpand } = this
      const { key, children } = props
      const h = this.$createElement
      const node = []
      const renderNode = (data, tier = -1) => {
        tier++
        return data.forEach((row, index) => {
          const id = row[key]
          const childs = row[children] || []
          const expanded = this.expandeds[id]
          if (ids.includes(id)) {
            const offset = 18 * tier
            console.log(panelWidth, offset)
            node.push(h('div', { key: panelId + id + index, class: 'eff-transfer-panel-node', style: { marginLeft: offset + 'px' }}, [
              lazy || childs.length ? (lazy && expanded === 'loading' && !childs.length ? h('icon', { class: 'tree-loading', props: { icon: 'refresh' }}) : h('icon', { props: { icon: expanded ? 'caret-bottom' : 'caret-right' }, on: { click: () => handleExpand(row) }})) : h('span', { class: 'eff-transfer-blank' }),
              h('v-checkbox', {
                props: { value: selecteds.includes(id), label: row.label, disabled: isDisabled(row), indeterminate: isIndeterminate(id), labelWidth: panelWidth - offset - 50 },
                on: { change: selected => rowSelectionChange(row, selected) }
              })
            ]))
            expanded ? renderNode(childs, tier) : ''
          }
        })
      }
      renderNode(data)
      return node
    },
    isVirtual() {
      const { renderNode: { length }, bodyHeight } = this
      return (length - 4) * 30 > bodyHeight
    },
    endIndex() {
      const { isVirtual, startIndex, renderNode: { length }, bodyHeight } = this
      return isVirtual ? Math.floor(bodyHeight / 30) + 2 + startIndex : length
    },
    renderNodes() {
      const { renderNode, startIndex, endIndex } = this
      return renderNode.slice(startIndex, endIndex)
    },
    panelId() {
      return (~~(Math.random() * (1 << 30))).toString(36)
    },
    isLazy() {
      const { lazy, loadMethod } = this
      return lazy && XEUtils.isFunction(loadMethod)
    }
  },
  watch: {
    selecteds(val, oldVal) {
      this.updateSelectionAll()
      const changeKeys = val.length > oldVal.length ? val.filter(d => oldVal.indexOf(d) === -1) : oldVal.filter(d => val.indexOf(d) === -1)
      this.$emit('input', this.checkeds)
      this.$emit('change', val, changeKeys)
    },
    ids() {
      this.setDataStore()

      if (!this.loadData) {
        this.setDefaultChecked()
        this.setDefaultExpanded()
        this.loadData = true
      } else {
        this.clearSelection()
      }
    }
  },
  inject: ['transfer'],
  created() {
    Object.assign(this, {
      loadData: false
    })
    if (this.data.length) {
      this.loadData = true
      this.setDataStore()
      this.setDefaultChecked()
      this.setDefaultExpanded()
    }
    // console.log('this.dataStore', JSON.stringify(this.dataStore, null, 2))
  },
  mounted() {
    this.$nextTick(() => {
      const { transfer, $refs } = this
      const { header, body } = $refs
      this.body = body
      this.bodyHeight = transfer.height - header.clientHeight
      on(this.body, 'scroll', this.handleScroll)
      on(window, 'resize', this.handleResize)
      setTimeout(() => {
        this.handleResize()
      }, 100)
    })
  },
  beforeDestroy() {
    off(this.body, 'scroll', this.handleScroll)
    off(window, 'resize', this.handleResize)
  },
  methods: {
    tipShow(opts) {
      this.$refs.popover.doShow()
      this.popoverOpts = opts
    },
    tipClose() {
      this.$refs.popover.doHide()
    },
    handleResize() {
      if (this.body) {
        this.panelWidth = this.body.clientWidth
      }
    },
    handleScroll(e) {
      const { scrollTop } = e.target
      if (scrollTop < 30) {
        this.startIndex = 0
      }
      this.startIndex = Math.floor(scrollTop / 30)
    },
    setDefaultChecked() {
      const { defaultCheckedKeys, dataStore } = this
      if (defaultCheckedKeys.length) {
        defaultCheckedKeys.forEach(id => {
          const store = dataStore[id]
          store && this.toggleSelection(store.row, null, true)
        })
      }
    },
    setDefaultExpanded() {
      const { ids, expandeds, expandedAll, defaultExpandedKeys } = this
      if (expandedAll) {
        ids.forEach(id => {
          this.$set(expandeds, id, true)
        })
      } else {
        defaultExpandedKeys.forEach(id => {
          if (ids.includes(id)) this.$set(expandeds, id, true)
        })
      }
    },
    setChecked(id, checked) {
      this.dataStore[id] && this.$set(this.dataStore[id], 'checked', checked)
    },
    isChecked(id) {
      return !!this.dataStore[id]
    },
    setAllChecked(checked) {
      const { dataStore } = this
      for (const key in dataStore) {
        const row = dataStore[key]
        row.checked = checked
      }
    },
    getAllChecked() {
      const { dataStore } = this
      const checkeds = []
      for (const key in dataStore) {
        const row = dataStore[key]
        const { id, checked } = row
        checked && checkeds.push(id)
      }
      return checkeds
    },
    clearSelection() {
      this.setAllChecked(false)
    },
    updateSelectionAll() {
      const { selecteds, dataStore } = this
      const data = []
      for (const key in dataStore) {
        const row = dataStore[key]
        const { id } = row
        data.push(id)
      }
      const selectedsLength = selecteds.length
      const dataLength = data.length
      this.selectionAll = Boolean(selectedsLength && selectedsLength === dataLength)
      this.indeterminate = Boolean(selectedsLength && selectedsLength < dataLength)
    },
    setDataStore() {
      const { transferDataStore, ids, selecteds, isLazy, expandedAll } = this
      for (const key in transferDataStore) {
        const store = transferDataStore[key]
        const { id, parents = [], childs = [], siblings = [] } = store
        const checked = selecteds.includes(id)
        if (ids.includes(id)) {
          this.$set(this.dataStore, id, Object.assign({}, store, {
            siblings: siblings.filter(d => ids.includes(d)),
            parents: parents.filter(d => ids.includes(d)),
            childs: childs.filter(d => ids.includes(d)),
            checked
          }))
        }
      }
      if (isLazy && expandedAll) {
        this.expandeds = [...ids]
      }
      // console.log('this.dataStore', JSON.stringify(this.dataStore, null, 2))
      return this.$nextTick()
    },
    toggleRowSelection(row, selected) {
      const { dataStore, props, toggleSelection, isChecked } = this
      const id = row[props.key]
      if (dataStore[id]) {
        toggleSelection(row, isChecked[id], selected)
      } else {
        console.error('methods toggleRowSelection (row) is not find')
      }
    },
    toggleAllSelection() {
      this.selectionAll = !this.selectionAll
      this.allselectionChange(this.selectionAll)
    },
    rowSelectionChange(row, selected) {
      const { checkeds, dataStore, props, toggleSelection } = this
      const id = row[props.key]
      toggleSelection(row, !selected)
      this.$emit('select', checkeds, dataStore[id])
    },
    allselectionChange(selected) {
      this.selectionAll = selected
      this.indeterminate = false
      this.setAllChecked(selected)
      this.$emit('select-all', this.checkeds)
    },
    toggleSelection(row, has, selected) {
      // console.log({ row, has, selected })
      const { props, dataStore, setChecked } = this
      const { key } = props
      const id = row[key]

      // 处理当前节点
      const isCheck = Boolean(selected || !has)
      setChecked(id, isCheck)

      // 处理子节点
      for (const key in dataStore) {
        const { id: childid, parents = [] } = dataStore[key] || {}
        // console.log({ childid, id, parents, isCheck })
        if (parents.includes(id)) {
          setChecked(childid, isCheck)
        }
      }

      // 处理父级
      const { parents } = dataStore[id]
      if (parents.length) {
        let currentId = id
        const parantList = XEUtils.clone(parents, true)
        parantList.reverse().forEach(parentId => {
          // 用当前层级的同级确定上级的勾选状态
          const { checked, siblings } = dataStore[currentId]
          if (siblings.length) {
            const sibChecked = siblings.filter(sibid => dataStore[sibid].checked)
            // console.log({ currentId, siblings, sibChecked, parentId })
            setChecked(parentId, checked && sibChecked.length === siblings.length)
          } else { // 只有一级时直接确定
            setChecked(parentId, checked)
          }
          currentId = parentId
        })
      }
    },
    setCurrentRow(row) {
      const { dataStore } = this
      const id = row[this.props.key]
      this.setAllChecked(false)
      if (dataStore[id]) {
        this.setChecked(id, true)
      }
    },
    isDisabled(row) {
      const disabled = row[this.props.disabled]
      return XEUtils.isFunction(disabled) ? disabled({ row }) : Boolean(disabled)
    },
    isIndeterminate(id) {
      const { childs = [] } = this.dataStore[id] || {}
      if (!childs.length) return false
      const hasChecked = childs.find(c => this.selecteds.includes(c))
      const indeterminate = !!(hasChecked && childs.find(c => !this.selecteds.includes(c)))
      if (indeterminate) this.setChecked(id, false)
      return indeterminate
    },
    handleExpand(row) {
      const { dataStore, props, panel, isLazy, loadMethod } = this
      const { children } = props
      const childs = row[children] || []
      const { key } = this.props
      const id = row[key]
      // 异步加载
      if (isLazy && !childs.length) {
        this.$set(this.expandeds, id, 'loading')
        loadMethod({ row }).then(res => {
          this.$set(this.expandeds, id, true)
          this.$set(row, children, res)
          setTimeout(() => {
            this.$emit('lazy-data', { panel, id, data: res.map(d => d[key]) })
            dataStore[id].checked && this.toggleSelection(row, null, dataStore[id].checked)
          }, 100)
          // 如果父节点是选中的，加载的节点也变成选中
        })
      } else {
        this.$set(this.expandeds, id, !this.expandeds[id])
      }
    }
  },
  render(h) {
    const { renderNode, title, selectionAll, startIndex, renderNodes, indeterminate, dataStore, selecteds, $slots, popoverOpts, allselectionChange } = this
    return h('div', { ref: 'panel', class: 'eff-transfer-panel' }, [
      h('div', { ref: 'header', class: 'eff-transfer-panel__header' }, [
        h('v-checkbox', { props: { value: selectionAll, label: title, indeterminate }, on: { change: allselectionChange }}),
        h('small', {}, selecteds.length + '/' + Object.keys(dataStore).length)
      ]),
      h('div', { ref: 'body', class: 'eff-transfer-panel__body' }, [
        h('div', { class: 'eff-transfer-panel__body--y-space', style: { height: renderNode.length * 30 + 'px' }}),
        h('div', { class: 'eff-transfer-panel__body-wrapper', style: { marginTop: startIndex * 30 + 'px' }}, renderNodes)
      ]),
      $slots.default ? h('div', { class: 'eff-transfer-panel__footer' }, $slots.default) : '',
      h('Popover', { ref: 'popover', props: popoverOpts })
    ])
  }
}
