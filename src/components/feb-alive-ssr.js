export default () => {
  return {
    name: 'feb-alive',
    abstract: true,
    render () {
      const vnode = this.$slots.default ? this.$slots.default[0] : null
      return vnode
    }
  }
}
