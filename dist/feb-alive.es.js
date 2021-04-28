import _Object$assign from '@babel/runtime-corejs3/core-js-stable/object/assign';
import _sliceInstanceProperty from '@babel/runtime-corejs3/core-js-stable/instance/slice';
import _defineProperty from '@babel/runtime-corejs3/helpers/defineProperty';
import _keysInstanceProperty from '@babel/runtime-corejs3/core-js-stable/instance/keys';
import _concatInstanceProperty from '@babel/runtime-corejs3/core-js-stable/instance/concat';
import _typeof from '@babel/runtime-corejs3/helpers/typeof';
import _slicedToArray from '@babel/runtime-corejs3/helpers/slicedToArray';
import _spliceInstanceProperty from '@babel/runtime-corejs3/core-js-stable/instance/splice';
import _Object$keys from '@babel/runtime-corejs3/core-js-stable/object/keys';

/**
 * 记录所有浏览操作历史栈
 * record history stack
 */
var inBrowser$2 = typeof window !== 'undefined';
var routes = [];

if (inBrowser$2) {
  window.debug_routes = routes;
}

/**
 * 记录各层级页面缓存
 * record page cache
 */
var inBrowser$1 = typeof window !== 'undefined';
var cache = Object.create(null);

if (inBrowser$1) {
  window.debug_cache = cache;
}

var inBrowser = typeof window !== 'undefined';
var _toString = Object.prototype.toString; // 判断是否支持HTML5 history

var supportsPushState = inBrowser && function () {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }

  return window.history && 'pushState' in window.history;
}();
var supportHistoryState = function () {
  if (!supportsPushState) {
    return false;
  } // 测试写操作


  history.replaceState(_Object$assign({
    _debug: 'ok'
  }, history.state), null);

  if (!history.state) {
    return false;
  } else {
    var originState = _Object$assign({}, history.state);

    delete originState._debug;
    history.replaceState(originState, null);
    return true;
  }
}();
/**
 * 生成页面主键
 */

function genKey() {
  var t = 'xxxxxxxx';
  return t.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
/**
 * 检测路由匹配
 * @param {array | string | RegExp} pattern 路由主键数组/字符串/正则表达式
 * @param {string} name 路由主键
 */

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (pattern instanceof RegExp) {
    return pattern.test(name);
  }

  return false;
}
/**
 * 获取当前url路径
 * @param {string} base | 基础路径
 * @param {string} mode | 路由模式
 */

function getLocation(base, mode) {
  var path = window.location.pathname;

  if (mode === 'hash') {
    return window.location.hash.replace(/^#\//, '');
  }

  if (base && path.indexOf(base) === 0) {
    path = _sliceInstanceProperty(path).call(path, base.length);
  }

  return (path || '/') + window.location.search + window.location.hash;
}
/**
 * 删除数组中匹配元素
 * @param {string[]} arr 数组
 * @param {string} item 需要删除的元素
 */

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);

    if (index > -1) {
      return _spliceInstanceProperty(arr).call(arr, index, 1);
    }
  }
}
/**
 * 获取缓存组件实例
 * @param {object} cache 缓存
 * @param {string} key 主键
 */

function getCacheVnode(cache, key) {
  if (typeof key === 'string' || typeof key === 'number') {
    return getCacheVnode(cache, cache[key]);
  }

  return key;
}
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}
function deepClone(val) {
  if (isPlainObject(val)) {
    var res = {};

    for (var key in val) {
      res[key] = deepClone(val[key]);
    }

    return res;
  } else if (Array.isArray(val)) {
    return _sliceInstanceProperty(val).call(val);
  } else {
    return val;
  }
}
function defineRouteMeta(routes) {
  routes.forEach(function (route) {
    var meta = deepClone(route.meta);

    if (isPlainObject(route.meta)) {
      Object.defineProperty(route.meta, '_default', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: meta
      });
    }

    if (route.children) {
      defineRouteMeta(route.children);
    }
  });
}

function parsePath(path) {
  var hash = '';
  var query = '';
  var hashIndex = path.indexOf('#');

  if (hashIndex >= 0) {
    hash = _sliceInstanceProperty(path).call(path, hashIndex);
    path = _sliceInstanceProperty(path).call(path, 0, hashIndex);
  }

  var queryIndex = path.indexOf('?');

  if (queryIndex >= 0) {
    query = _sliceInstanceProperty(path).call(path, queryIndex + 1);
    path = _sliceInstanceProperty(path).call(path, 0, queryIndex);
  }

  return {
    pathStr: path,
    queryStr: query,
    hashStr: hash
  };
}

var genLocation = function genLocation(url) {
  var query = Object.create(null);

  var _parsePath = parsePath(url),
      pathStr = _parsePath.pathStr,
      queryStr = _parsePath.queryStr,
      hashStr = _parsePath.hashStr;

  if (queryStr) {
    queryStr.split('&').forEach(function (kv) {
      var _kv$split = kv.split('='),
          _kv$split2 = _slicedToArray(_kv$split, 2),
          key = _kv$split2[0],
          val = _kv$split2[1];

      query[key] = decodeURIComponent(val);
    });
  }

  return {
    path: pathStr,
    query: query,
    hash: hashStr
  };
};

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (_typeof(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

var stringifyQuery = function stringifyQuery(query) {
  var str = '';

  _Object$keys(query).forEach(function (key, index) {
    var val = query[key];

    if (index !== 0) {
      str += '&';
    }

    str += key + '=' + encodeURIComponent(stringifyPrimitive(val));
  });

  return str;
};
/**
 * 解析url
 * @param {string ｜ { path: string, query: { [key: string]: any } } } url 导航地址
 * @returns {string}
 */


var parseUrl = function parseUrl(url) {
  if (typeof url === 'string') {
    url = {
      path: url,
      query: Object.create(null)
    };
  } // path可能自带参数


  var _url = url,
      path = _url.path,
      query = _url.query;
  var location = genLocation(path);

  var newQuery = _Object$assign({}, location.query, query);

  var queryStr = stringifyQuery(newQuery);
  queryStr = queryStr ? '?' + queryStr : '';
  return location.path + queryStr + location.hash;
};

var FebAlive = (function (keyName, maxPage) {
  return {
    name: 'feb-alive',
    abstract: true,
    methods: {
      cacheClear: function cacheClear(key) {
        // fix: replace情况下 key未变化，导致实例未被销毁
        var vnode = this.cache[key];
        vnode && vnode.componentInstance && vnode.componentInstance.$destroy();

        if (maxPage && _keysInstanceProperty(this).length > parseInt(maxPage)) {
          var oldKey = _keysInstanceProperty(this)[0];

          var oldVnode = this.cache[oldKey];
          oldVnode && oldVnode.componentInstance && oldVnode.componentInstance.$destroy();
          remove(_keysInstanceProperty(this), oldKey);
          delete this.cache[oldKey];
        }

        for (var _key in this.cache) {
          if (!matches(routes, _key)) {
            var _vnode = this.cache[_key];
            _vnode && _vnode.componentInstance && _vnode.componentInstance.$destroy();
            remove(_keysInstanceProperty(this), _key);
            delete this.cache[_key];
          }
        }
      }
    },
    created: function created() {
      this.cache = Object.create(null);
      this.keys = [];
    },
    // 当路由变化时候，会触发feb-alive的$fourceUpdate
    render: function render() {
      // 取到router-view的vnode
      var vnode = this.$slots.default ? this.$slots.default[0] : null;
      var disableCache = this.$route.meta.disableCache; // 如果不支持html5 history 写操作则不做缓存处理

      if (!supportHistoryState) {
        return vnode;
      } // 尝试写入key


      if (!history.state || !history.state[keyName]) {
        var state = _defineProperty({}, keyName, genKey());

        var path = getLocation();
        history.replaceState(state, null, path);
      } // 有些浏览器不支持往state中写入数据


      if (!history.state) {
        return vnode;
      } // 核心逻辑


      if (vnode) {
        var _context;

        var cache$1 = this.cache,
            keys = _keysInstanceProperty(this);

        var key = history.state[keyName];
        var _this$$router$febReco = this.$router.febRecord,
            from = _this$$router$febReco.from,
            to = _this$$router$febReco.to;
        var parent = this.$parent;
        var depth = 0;
        var cacheVnode = null;
        vnode && (vnode.data.febAlive = true);

        while (parent && parent._routerRoot !== parent) {
          if (parent.$vnode && parent.$vnode.data.febAlive) {
            depth++;
          }

          parent = parent.$parent;
        } // 记录缓存及其所在层级


        this.depth = depth;
        cache[depth] = cache$1; // 底层路由才进行cache判断

        if (disableCache && to.matched.length === depth + 1) {
          return vnode;
        }
        /**
         * 内层feb-alive实例会被保存，防止从/home/a 跳转到 /other的时候内层feb-alive执行render时候，多生成一个实例
         * 例如 /home/a backTo /other
         */


        if (to.matched.length < depth + 1) {
          return null;
        }

        vnode.key = _concatInstanceProperty(_context = "__febAlive-".concat(key, "-")).call(_context, vnode.tag);

        if (from.matched[depth] === to.matched[depth] && depth !== to.matched.length - 1) {
          /**
           * 1.嵌套路由跳转中的父级路由
           * 2./home/a --> /home/b
           * 3.针对home组件，无需主动设置componentInstance
           * 4./home/a --> /home/b 时，home组件不应该重新实例化。直接进行key设置复用即可
           * 5.父路由通过key进行复用
           */
          cache$1[key] = cache$1[key] || _keysInstanceProperty(this)[_keysInstanceProperty(this).length - 1];
          cacheVnode = getCacheVnode(cache$1, cache$1[key]);

          if (cacheVnode) {
            vnode.key = cacheVnode.key;
            remove(keys, key);
            keys.push(key);
          } else {
            this.cacheClear(key);
            cache$1[key] = vnode;
            keys.push(key);
          }
        } else {
          /**
           * 1.嵌套路由跳转 && 子路由
           * 2.正常跳转 && 动态路由跳转
           * 3./a --> /b
           * 4./page/1 --> /page/2
           */
          cacheVnode = getCacheVnode(cache$1, key); // 只有相同的vnode才允许复用组件实例，否则虽然实例复用了，但是在patch的最后阶段，会将复用的dom删除

          if (cacheVnode && vnode.tag === cacheVnode.tag) {
            vnode.key = cacheVnode.key;
            vnode.componentInstance = cacheVnode.componentInstance;
            remove(keys, key);
            keys.push(key);
          } else {
            this.cacheClear(key);
            cache$1[key] = vnode;
            keys.push(key);
          }
        }

        vnode.data.keepAlive = true;
      }

      return vnode;
    },
    destroyed: function destroyed() {
      for (var key in this.cache) {
        var vnode = this.cache[key];
        vnode && vnode.componentInstance.$destroy();
        delete cache[this.depth][key];
      }

      this.keys = [];
      this.cache = {};
    }
  };
});

var FebAliveSSR = (function () {
  return {
    name: 'feb-alive',
    abstract: true,
    render: function render() {
      var vnode = this.$slots.default ? this.$slots.default[0] : null;
      return vnode;
    }
  };
});

var nav = (function (bus, keyName) {
  var forward = function forward(name, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes$1 = routes;
    from.name = routes$1[routes$1.length - 1] || null;
    to.name = name;
    routes$1.push(name);
    bus.$emit('forward', to, from);
  };

  var back = function back(count, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes$1 = routes;
    from.name = routes$1[routes$1.length - 1];
    to.name = routes$1[routes$1.length - 1 - count];

    _spliceInstanceProperty(routes$1).call(routes$1, routes.length - count, count);

    bus.$emit('back', to, from);
  };

  var replace = function replace(name, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes$1 = routes;
    from.name = routes$1[routes$1.length - 1] || null;
    to.name = name;

    _spliceInstanceProperty(routes$1).call(routes$1, routes.length - 1, 1, name);

    bus.$emit('replace', to, from);
  };

  var refresh = function refresh(toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes$1 = routes;
    to.name = from.name = routes$1[routes$1.length - 1];
    bus.$emit('refresh', to, from);
  };

  var reset = function reset() {
    _spliceInstanceProperty(routes).call(routes, 0, routes.length);

    bus.$emit('reset');
  };

  var record = function record(toRoute, fromRoute, replaceFlag) {
    if (!history.state) {
      return;
    }
    /**
     * 1. 当使用默认的history.key时，如果route配置中没有设置scrollBehavior，那么首次取到的就是空值
     * 2. 其他情况下首次都为空，需要主动设置，否则在cacheClear时，会把首次渲染的页面缓存删除
     */


    var name = history.state[keyName];

    if (!name) {
      // 首次渲染进入当前逻辑
      var key = genKey();

      var state = _defineProperty({}, keyName, key);

      var path = getLocation();
      history.replaceState(state, null, path);
      name = key;
    }

    if (replaceFlag) {
      replace(name, toRoute, fromRoute);
    } else {
      var toIndex = routes.lastIndexOf(name);

      if (toIndex === -1) {
        forward(name, toRoute, fromRoute);
      } else if (toIndex === routes.length - 1) {
        refresh(toRoute, fromRoute);
      } else {
        back(routes.length - 1 - toIndex, toRoute, fromRoute);
      }
    }
  };

  return {
    record: record,
    reset: reset
  };
});

var metaMap = Object.create(null);
var hasReset = false;
var FebAlivePlugin = {
  /**
   * 插件安装
   * @param {function} Vue
   * @param {object} config
   * @returns
   */
  install: function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        router = _ref.router,
        _ref$keyName = _ref.keyName,
        keyName = _ref$keyName === void 0 ? 'key' : _ref$keyName,
        _ref$isServer = _ref.isServer,
        isServer = _ref$isServer === void 0 ? false : _ref$isServer,
        _ref$maxPage = _ref.maxPage,
        maxPage = _ref$maxPage === void 0 ? 10 : _ref$maxPage,
        beforeLocationChange = _ref.beforeLocationChange;

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
    var routes$1 = router.options.routes;
    /**
     * 记录路由初始meta
     * record default route.meta
     */

    defineRouteMeta(routes$1);
    var bus = new Vue();
    var navigator = nav(bus, keyName);
    var replace = router.replace;
    var lastKey = '';
    var replaceFlag = false;

    router.replace = function () {
      replaceFlag = true;
      replace.apply(this, arguments);
    };

    router.beforeEach(function (to, from, next) {
      // 重置meta
      _Object$assign(to.meta, to.meta._default);

      router.febRecord = {
        to: to,
        from: from,
        replaceFlag: replaceFlag
      };
      next();
    });
    /**
     * tip: vue-router@3.3.0 版本之前不能使用afterEach来处理缓存恢复逻辑，
     * 因为afterEach钩子执行时，url还没有改变，导致取到的页面key还是上一个
     * 页面的，会导致缓存存取异常
     * issue: https://github.com/vuejs/vue-router/pull/2292
     */

    router.afterEach(function (to, from) {
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
      to: function to(url) {
        var native = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        try {
          if (!url) {
            console.warn('FEB-ALIVE: 跳转链接不能为空');
            return;
          }

          url = parseUrl(url);
          url = url.replace(new RegExp("^".concat(location.origin)), '');
          var matchRoute = router.match(url);
          var matched = matchRoute.matched;

          if (!matched.length || matched[0].path === '*' || native) {
            window.location.href = url;
            return;
          }

          if (!beforeLocationChange) {
            router.push({
              path: url
            });
            return;
          }

          beforeLocationChange(matchRoute, function (state) {
            if (state === false) {
              window.location.href = url;
            } else {
              router.push({
                path: url
              });
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
      replace: function replace(url) {
        var native = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        try {
          if (!url) {
            console.warn('FEB-ALIVE: 跳转链接不能为空');
            return;
          }

          url = parseUrl(url);
          url = url.replace(new RegExp("^".concat(location.origin)), '');
          var matchRoute = router.match(url);
          var matched = matchRoute.matched;

          if (!matched.length || matched[0].path === '*' || native) {
            window.location.replace(url);
            return;
          }

          if (!beforeLocationChange) {
            router.replace({
              path: url
            });
            return;
          }

          beforeLocationChange(matchRoute, function (state) {
            if (state === false) {
              window.location.replace(url);
            } else {
              router.replace({
                path: url
              });
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
      go: function go(step) {
        router.go(step);
      },

      /**
       * 导航返回
       */
      back: function back() {
        router.back();
      },

      /**
       * 导航前进
       */
      forward: function forward() {
        router.forward();
      },

      /**
       * 恢复缓存，确保在导航切换后执行
       * recover cache after url has change
       * @param {VueRouter} from 当前导航正要离开的路由
       * @param {VueRouter} to 即将要进入的目标
       * @returns
       */
      recoverMeta: function recoverMeta(from, to) {
        var isSamePage = from.path === to.path;
        var fromMeta = from.meta;
        var toMeta = to.meta;
        var key = history.state[keyName];
        var isReplace = router.febRecord.replaceFlag; // 是否是replace跳转

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

        if (!isReplace || isReplace && isSamePage) {
          if (metaMap[key]) {
            _Object$assign(toMeta, metaMap[key]);

            toMeta.fromCache = true;
          }
        }

        return toMeta;
      },

      /**
       * 获取所有缓存路由key
       * @returns {string[]} 路由key
       */
      getRoutes: function getRoutes() {
        return _sliceInstanceProperty(routes).call(routes);
      },

      /**
       * 获取所有缓存路由
       * @returns {object}
       */
      getCache: function getCache() {
        return cache;
      },

      /**
       * 获取当前页面路由缓存主键
       * @returns {string}
       */
      getKey: function getKey() {
        return history.state && history.state[keyName];
      },

      /**
       * 清除所有路由缓存
       * @returns void
       */
      cleanRoutes: function cleanRoutes() {
        return navigator.reset();
      },

      /**
       * 监听导航事件
       * @param {string} event  forward | back | replace | refresh | reset
       * @param {function} callback
       */
      on: function on(event, callback) {
        bus.$on(event, callback);
      },

      /**
       * 监听导航事件，单次
       * @param {string} event
       * @param {function} callback
       */
      once: function once(event, callback) {
        bus.$once(event, callback);
      },

      /**
       * 移除监听事件
       * @param {string} event
       * @param {function} callback
       */
      off: function off(event, callback) {
        bus.$off(event, callback);
      }
    };
  },

  /**
   * 重写浏览器原生history.replaceState方法
   */
  resetHistory: function resetHistory() {
    if (typeof history !== 'undefined' && !hasReset) {
      var nativeHistoryReplaceState = history.replaceState.bind(history);

      history.replaceState = function (state, title, path) {
        nativeHistoryReplaceState(_Object$assign({}, history.state, state), title, path);
      };

      hasReset = true;
    }
  }
};

export default FebAlivePlugin;
