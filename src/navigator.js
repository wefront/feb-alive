import Routes from './routes'

export default (bus, keyName) => {
  const forward = (name, toRoute, fromRoute) => {
    const to = { route: toRoute }
    const from = { route: fromRoute }
    const routes = Routes
    from.name = routes[routes.length - 1] || null
    to.name = name
    routes.push(name)
    bus.$emit('forward', to, from)
  }
  const back = (count, toRoute, fromRoute) => {
    const to = { route: toRoute }
    const from = { route: fromRoute }
    const routes = Routes
    from.name = routes[routes.length - 1]
    to.name = routes[routes.length - 1 - count]
    routes.splice(Routes.length - count, count)
    bus.$emit('back', to, from)
  }
  const replace = (name, toRoute, fromRoute) => {
    const to = { route: toRoute }
    const from = { route: fromRoute }
    const routes = Routes
    from.name = routes[routes.length - 1] || null
    to.name = name
    routes.splice(Routes.length - 1, 1, name)
    bus.$emit('replace', to, from)
  }
  const refresh = (toRoute, fromRoute) => {
    const to = { route: toRoute }
    const from = { route: fromRoute }
    const routes = Routes
    to.name = from.name = routes[routes.length - 1]
    bus.$emit('refresh', to, from)
  }
  const reset = () => {
    Routes.splice(0, Routes.length)
    bus.$emit('reset')
  }

  const record = (toRoute, fromRoute, replaceFlag) => {
    if (!history.state) {
      return
    }
    const name = history.state[keyName]
    if (!name) {
      return
    }
    if (replaceFlag) {
      replace(name, toRoute, fromRoute)
    } else {
      const toIndex = Routes.lastIndexOf(name)
      if (toIndex === -1) {
        forward(name, toRoute, fromRoute)
      } else if (toIndex === Routes.length - 1) {
        refresh(toRoute, fromRoute)
      } else {
        back(Routes.length - 1 - toIndex, toRoute, fromRoute)
      }
    }
  }

  return {
    record, reset
  }
}
