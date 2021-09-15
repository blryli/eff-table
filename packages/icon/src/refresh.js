export default {
  name: 'Refresh',
  functional: true,
  render(h, context) {
    const { props: { title = '刷新' }} = context
    return (<div
      class='eff-icon-refresh'
      title={title}
    >
      <div class='eff-icon-refresh-icon'>
        <div class='eff-icon-refresh-blank' />
        <div class='eff-icon-refresh-round' />
      </div>
      <div class='eff-icon-refresh-icon symmetry'>
        <div class='eff-icon-refresh-blank' />
        <div class='eff-icon-refresh-round' />
      </div>
    </div>)
  }
}
