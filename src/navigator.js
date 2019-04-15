import Routes from './routes'
import { genKey, getLocation } from './utils'

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

    /**
     * 1. 当使用默认的history.key时，如果route配置中没有设置scrollBehavior，那么首次取到的就是空值
     * 2. 其他情况下首次都为空，需要主动设置，否则在cacheClear时，会把首次渲染的页面缓存删除
     */
    let name = history.state[keyName]
    if (!name) {
      // 首次渲染进入当前逻辑
      const key = genKey()
      const state = {
        [keyName]: key
      }
      const path = getLocation()
      history.replaceState(state, null, path)
      name = key
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
