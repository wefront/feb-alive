import FebAlive from './components/feb-alive';
import FebAliveSSR from './components/feb-alive-ssr';
import febRoutes from './routes';
import febCache from './cache';
import nav from './navigator';
import { defineRouteMeta, deepClone, parseUrl } from './utils';

const metaMap = Object.create(null);
let hasReset = false;

const FebAlivePlugin = {
  /**
   * 插件安装
   * @param {function} Vue
   * @param {object} config
   * @returns
   */
  install: (
    Vue,
    {
      router, // 路由实例
      keyName = 'key', // 缓存键名，默认key
      isServer = false, // 服务端渲染
      maxPage = 10, // 最大缓存页数，默认缓存10条
      beforeLocationChange, // 页面跳转前拦截函数，(matchRoute: object, cb) => void
    } = {},
  ) => {
    if (isServer) {
      Vue.component('feb-alive', FebAliveSSR());
      return;
    }

    Vue.component('feb-alive', FebAlive(keyName, maxPage));

    if (!router) {
      console.warn('need options: router');
      return;
    }

    window.debug_metaMap = metaMap;

    const routes = router.options.routes;

    /**
     * 记录路由初始meta
     * record default route.meta
     */
    defineRouteMeta(routes);

    const bus = new Vue();
    const navigator = nav(bus, keyName);
    const replace = router.replace;
    let lastKey = '';
    let replaceFlag = false;

    router.replace = function() {
      replaceFlag = true;
      replace.apply(this, arguments);
    };

    router.beforeEach((to, from, next) => {
      // 重置meta
      Object.assign(to.meta, to.meta._default);
      router.febRecord = {
        to,
        from,
        replaceFlag,
      };
      next();
    });

    /**
     * tip: vue-router@3.3.0 版本之前不能使用afterEach来处理缓存恢复逻辑，
     * 因为afterEach钩子执行时，url还没有改变，导致取到的页面key还是上一个
     * 页面的，会导致缓存存取异常
     * issue: https://github.com/vuejs/vue-router/pull/2292
     */
    router.afterEach((to, from) => {
      /**
       * 恢复meta缓存
       * recover to.meta
       */
      Vue.location.recoverMeta(from, to);
      navigator.record(to, from, replaceFlag);
      replaceFlag = false;
    });

    /**
     * 浏览器端持有
     * only in browser
     */
    Vue.location = Vue.prototype.$location = {
      /**
       * 导航跳转
       * @param {string | object} url 跳转地址
       * @param {boolean} native 是否使用原生跳转
       * @returns
       */
      to: (url, native = false) => {
        try {
          if (!url) {
            console.warn('FEB-ALIVE: 跳转链接不能为空');
            return;
          }

          url = parseUrl(url);

          url = url.replace(new RegExp(`^${location.origin}`), '');
          const matchRoute = router.match(url);
          const matched = matchRoute.matched;
          if (!matched.length || matched[0].path === '*' || native) {
            window.location.href = url;
            return;
          }
          if (!beforeLocationChange) {
            router.push({ path: url });
            return;
          }
          beforeLocationChange(matchRoute, state => {
            if (state === false) {
              window.location.href = url;
            } else {
              router.push({ path: url });
            }
          });
        } catch (err) {
          console.log(err);
        }
      },

      /**
       * 导航替换跳转
       * @param {string | object} url 跳转地址
       * @param {boolean} native 是否使用原生跳转
       * @returns
       */
      replace: (url, native = false) => {
        try {
          if (!url) {
            console.warn('FEB-ALIVE: 跳转链接不能为空');
            return;
          }

          url = parseUrl(url);

          url = url.replace(new RegExp(`^${location.origin}`), '');
          const matchRoute = router.match(url);
          const matched = matchRoute.matched;
          if (!matched.length || matched[0].path === '*' || native) {
            window.location.replace(url);
            return;
          }
          if (!beforeLocationChange) {
            router.replace({ path: url });
            return;
          }
          beforeLocationChange(matchRoute, state => {
            if (state === false) {
              window.location.replace(url);
            } else {
              router.replace({ path: url });
            }
          });
        } catch (err) {
          console.error(err);
        }
      },

      /**
       * 导航跳转前进/返回n个历史栈
       * @param {number} step 前进/后退 n 步
       */
      go(step) {
        router.go(step);
      },

      /**
       * 导航返回
       */
      back() {
        router.back();
      },
      /**
       * 导航前进
       */
      forward() {
        router.forward();
      },

      /**
       * 恢复缓存，确保在导航切换后执行
       * recover cache after url has change
       * @param {VueRouter} from 当前导航正要离开的路由
       * @param {VueRouter} to 即将要进入的目标
       * @returns
       */
      recoverMeta(from, to) {
        const isSamePage = from.path === to.path;
        const fromMeta = from.meta;
        const toMeta = to.meta;
        const key = history.state[keyName];
        const isReplace = router.febRecord.replaceFlag; // 是否是replace跳转

        /**
         * 保证缓存的meta是页面离开时最后一刻的状态
         */
        if (!fromMeta.disableCache && lastKey) {
          metaMap[lastKey] = deepClone(fromMeta);
        }

        lastKey = key;

        /**
         * 标记当前页面路由meta是否是从缓存中恢复而来
         */
        toMeta.fromCache = false;

        /**
         * 非replace跳转，或者replace相同路由，需要进行meta缓存匹配逻辑
         * 场景一: /a ->(push) /b，/b ->(back) /a，需要从缓存中恢复/a的meta数据
         * 场景二: /a ->(replace) /a，需要从缓存中恢复/a的meta数据
         */
        if (!isReplace || (isReplace && isSamePage)) {
          if (metaMap[key]) {
            Object.assign(toMeta, metaMap[key]);
            toMeta.fromCache = true;
          }
        }

        return toMeta;
      },

      /**
       * 获取所有缓存路由key
       * @returns {string[]} 路由key
       */
      getRoutes: () => febRoutes.slice(),

      /**
       * 获取所有缓存路由
       * @returns {object}
       */
      getCache: () => febCache,

      /**
       * 获取当前页面路由缓存主键
       * @returns {string}
       */
      getKey: () => {
        return history.state && history.state[keyName];
      },

      /**
       * 清除所有路由缓存
       * @returns void
       */
      cleanRoutes: () => navigator.reset(),

      /**
       * 监听导航事件
       * @param {string} event  forward | back | replace | refresh | reset
       * @param {function} callback
       */
      on: (event, callback) => {
        bus.$on(event, callback);
      },

      /**
       * 监听导航事件，单次
       * @param {string} event
       * @param {function} callback
       */
      once: (event, callback) => {
        bus.$once(event, callback);
      },

      /**
       * 移除监听事件
       * @param {string} event
       * @param {function} callback
       */
      off: (event, callback) => {
        bus.$off(event, callback);
      },
    };
  },

  /**
   * 重写浏览器原生history.replaceState方法
   */
  resetHistory() {
    if (typeof history !== 'undefined' && !hasReset) {
      const nativeHistoryReplaceState = history.replaceState.bind(history);
      history.replaceState = function(state, title, path) {
        nativeHistoryReplaceState(Object.assign({}, history.state, state), title, path);
      };
      hasReset = true;
    }
  },
};

export default FebAlivePlugin;
