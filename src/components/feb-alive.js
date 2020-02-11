import febRoutes from '../routes'
import febCache from '../cache'
import { genKey, supportHistoryState, matches, getLocation, getCacheVnode, remove } from '../utils'

export default (keyName, maxPage) => {
  return {
    name: 'feb-alive',
    abstract: true,
    methods: {
      cacheClear (key) {
        // Fix: replace情况下 key未变化，导致实例未被销毁
        const vnode = this.cache[key]
        vnode && vnode.componentInstance && vnode.componentInstance.$destroy()

        if (maxPage && this.keys.length > parseInt(maxPage)) {
          const oldKey = this.keys[0]
          const oldVnode = this.cache[oldKey]
          oldVnode && oldVnode.componentInstance && oldVnode.componentInstance.$destroy()
          remove(this.keys, oldKey)
          delete this.cache[oldKey]
        }

        for (const key in this.cache) {
          if (!matches(febRoutes, key)) {
            const vnode = this.cache[key]
            vnode && vnode.componentInstance && vnode.componentInstance.$destroy()
            remove(this.keys, key)
            delete this.cache[key]
          }
        }
      }
    },
    created () {
      this.cache = Object.create(null)
      this.keys = []
    },

    // 当路由变化时候，会触发feb-alive的$fourceUpdate
    render () {

      // 取到router-view的vnode
      const vnode = this.$slots.default ? this.$slots.default[0] : null
      const disableCache = this.$route.meta.disableCache
  
      // 如果不支持html5 history 写操作则不做缓存处理
      if (!supportHistoryState) {
        return vnode
      }

      // 尝试写入key
      if (!history.state || !history.state[keyName]) {
        const state = {
          [keyName]: genKey()
        }
        const path = getLocation()
        history.replaceState(state, null, path)
      }

      // 有些浏览器不支持往state中写入数据
      if (!history.state) {
        return vnode
      }

      // 指定不使用缓存
      // if (disableCache) {
      //   return vnode
      // }

      // 核心逻辑
      if (vnode) {
        const { cache, keys } = this
        const key = history.state[keyName]
        const { from, to } = this.$router.febRecord
        let parent = this.$parent
        let depth = 0
        let cacheVnode = null
        vnode && (vnode.data.febAlive = true)
        while (parent && parent._routerRoot !== parent) {
          if (parent.$vnode && parent.$vnode.data.febAlive) {
            depth++
          }
          parent = parent.$parent
        }

        // 记录缓存及其所在层级
        febCache[depth] = cache

        // 底层路由才进行cache判断
        if (disableCache && to.matched.length === depth + 1) {
          return vnode;
        } 

        /**
         * 内层feb-alive实例会被保存，防止从/home/a 跳转到 /other的时候内层feb-alive执行render时候，多生成一个实例
         * 例如 /home/a backTo /other
         */
        if (to.matched.length < depth + 1) {
          return null
        }

        vnode.key = `__febAlive-${key}-${vnode.tag}`

        if (from.matched[depth] === to.matched[depth] && depth !== to.matched.length - 1) {
          /**
           * 1.嵌套路由跳转中的父级路由
           * 2./home/a --> /home/b
           * 3.针对home组件，无需主动设置componentInstance
           * 4./home/a --> /home/b 时，home组件不应该重新实例化。直接进行key设置复用即可
           * 5.父路由通过key进行复用
           */
          cache[key] = cache[key] || this.keys[this.keys.length - 1]

          cacheVnode = getCacheVnode(cache, cache[key])
          if (cacheVnode) {
            vnode.key = cacheVnode.key
            remove(keys, key)
            keys.push(key)
          } else {
            this.cacheClear(key)
            cache[key] = vnode
            keys.push(key)
          }
        } else {
          /**
           * 1.嵌套路由跳转 && 子路由
           * 2.正常跳转 && 动态路由跳转
           * 3./a --> /b
           * 4./page/1 --> /page/2
           */
          cacheVnode = getCacheVnode(cache, key)
          // 只有相同的vnode才允许复用组件实例，否则虽然实例复用了，但是在patch的最后阶段，会将复用的dom删除
          if (cacheVnode && vnode.tag === cacheVnode.tag) {
            vnode.key = cacheVnode.key
            vnode.componentInstance = cacheVnode.componentInstance
            remove(keys, key)
            keys.push(key)
          } else {
            this.cacheClear(key)
            cache[key] = vnode
            keys.push(key)
          }
        }
        vnode.data.keepAlive = true
      }
      return vnode
    },
    destroyed () {
      for (const key in this.cache) {
        const vnode = this.cache[key]
        vnode && vnode.componentInstance.$destroy()
      }
      this.keys = []
      this.cache = {}
    }
  }
}
