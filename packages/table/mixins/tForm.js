export default {
  data() {
    return {
      tForm: {}
    }
  },
  methods: {
    clearForm(search) {
      this.$refs.tableForm.clear(search)
    },
    setFormFiled(prop, value) {
      this.$set(this.tForm, prop, value)
    },
    setForm(value) {
      this.$refs.tableForm.setForm(value)
    }
  }
}
