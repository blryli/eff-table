import Transfer from './src/transfer'

Transfer.install = (vue) => {
  vue.component(Transfer.name, Transfer)
}

export default Transfer
