import Card from './src/card'

Card.install = (vue) => {
  vue.component(Card.name, Card)
}

export default Card
