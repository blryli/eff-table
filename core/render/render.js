import { render } from './'

export default {
  name: 'VRender',
  props: {
    config: { type: Object, default: () => ({}) },
    context: { type: Object, default: () => ({}) }
  },
  render(h) {
    const { config, context, $slots } = this

    const opts = Object.assign({}, config, { defaultSlot: $slots.default })
    return render(h, opts, context).render()
  }
}
