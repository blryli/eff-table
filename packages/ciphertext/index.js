import Ciphertext from './src/ciphertext'

Ciphertext.install = (vue) => {
  vue.component(Ciphertext.name, Ciphertext)
}

export default Ciphertext
