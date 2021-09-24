<template>
  <div>
    <Icon icon="query" @click="click" />
    <SeniorQuery ref="seniorQuery" :field-list="fieldList" @change="change" />
  </div>
</template>

<script>
import SeniorQuery from 'pk/senior-query'
export default {
  name: 'Query',
  inject: ['table'],
  components: {
    SeniorQuery
  },
  data() {
    return {
      fieldList: []
    }
  },
  created() {
    const { seniorQueryConfig = {}} = this.table
    const { fieldList } = seniorQueryConfig
    this.fieldList = fieldList
  },
  methods: {
    click() {
      this.$refs.seniorQuery.open()
    },
    change(tableData) {
      this.table.seniorQuery = tableData
      this.table.commitProxy('query')
    }
  }
}
</script>
