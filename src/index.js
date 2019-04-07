import FebAlive from './components/feb-alive'
import FebAliveSSR from './components/feb-alive-ssr'
import febRoutes from './routes'
import febCache from './cache'
import nav from './navigator'
import { defineRouteMeta, deepClone, parseUrl } from './utils'

const metaMap = Object.create(null)
let hasReset = false

export default {
  install: (Vue, { router, keyName = 'key', isServer = false, maxPage = 10, beforeLocationChange } = {}) => {
    if (isServer) {
      Vue.component('feb-alive', FebAliveSSR())
      return
    }

    Vue.component('feb-alive', FebAlive(keyName, maxPage))

    if (!router) {
      console.warn('need options: router')
      return
    }

    window.debug_metaMap = metaMap

    // 缓存路由初始meta
    const routes = router.options.routes

    defineRouteMeta(routes)

    const bus = new Vue()
    const navigator = nav(bus, keyName)
    const replace = router.replace
    let lastKey = ''
    let replaceFlag = false

    router.replace = function () {
      replaceFlag = true
      replace.apply(this, arguments)
    }

    const ensureURL = router.history.ensureURL
    router.history.ensureURL = function () {
      ensureURL.apply(this, arguments)
      // recover to.meta
      const from = router.febRecord.from
      const to = router.febRecord.to
      Vue.location.recoverMeta(from, to)
      // do record
      navigator.record(to, from, replaceFlag)
      replaceFlag = false
    }

    router.beforeEach((to, from, next) => {
      // reset to.meta
      Object.assign(to.meta, to.meta._default)
      router.febRecord = {
        to,
        from,
        replaceFlag
      }
      next()
    })

    // 只有客户端才有的方法
    Vue.location = Vue.prototype.$location = {
      to: (url, native = false) => {
        try {
          if (!url) {
            console.warn('FEB-ALIVE: 跳转链接不能为空')
            return
          }

          url = parseUrl(url)

          url = url.replace(new RegExp(`^${location.origin}`), '')
          const matchRoute = router.match(url)
          const matched = matchRoute.matched
          if (!matched.length || matched[0].path === '*' || native) {
            window.location.href = url
            return
          }
          if (!beforeLocationChange) {
            router.push({ path: url })
            return
          }
          beforeLocationChange(route, (state) => {
            if (state === false) {
              window.location.href = url
            } else {
              router.push({ path: url })
            }
          })
        } catch (err) {
          console.log(err)
        }
      },
      replace: (url, native = false) => {
        try {
          if (!url) {
            console.warn('FEB-ALIVE: 跳转链接不能为空')
            return
          }

          url = parseUrl(url)

          url = url.replace(new RegExp(`^${location.origin}`), '')
          const matchRoute = router.match(url)
          const matched = matchRoute.matched
          if (!matched.length || matched[0].path === '*' || native) {
            window.location.replace(url)
            return
          }
          if (!beforeLocationChange) {
            router.replace({ path: url })
            return
          }
          beforeLocationChange(route, (state) => {
            if (state === false) {
              window.location.replace(url)
            } else {
              router.replace({ path: url })
            }
          })
        } catch (err) {
          console.log(err)
        }
      },
      go (n) {
        router.go(n)
      },
      back () {
        router.back()
      },
      forward () {
        router.forward()
      },
      // 恢复缓存，确保在导航切换后执行
      recoverMeta (from, to) {
        const isSamePage = from.path === to.path
        const fromMeta = from.meta
        const toMeta = to.meta
        const key = history.state[keyName]
        const isReplace = router.febRecord.replaceFlag
        // 缓存上一页面meta配置
        if (!fromMeta.disableCache && lastKey) {
          metaMap[lastKey] = deepClone(fromMeta)
        }
        lastKey = key
        // 匹配meta缓存
        toMeta.fromCache = false
        if (!isReplace || (isReplace && isSamePage)) {
          if (metaMap[key]) {
            Object.assign(toMeta, metaMap[key])
            toMeta.fromCache = true

          }
        }
        return toMeta
      },
      getRoutes: () => febRoutes.slice(),
      getCache: () => febCache,
      getKey: () => {
        return history.state && history.state[keyName]
      },
      cleanRoutes: () => navigator.reset(),
      on: (event, callback) => {
        bus.$on(event, callback)
      },
      once: (event, callback) => {
        bus.$once(event, callback)
      },
      off: (event, callback) => {
        bus.$off(event, callback)
      }
    }
  },
  resetHistory () {
    if (typeof history !== 'undefined' && !hasReset) {
      const nativeHistoryReplaceState = history.replaceState.bind(history)
      history.replaceState = function (state, title, path) {
        nativeHistoryReplaceState(Object.assign({}, history.state, state), title, path)
      }
      hasReset = true
    }
  }
}
