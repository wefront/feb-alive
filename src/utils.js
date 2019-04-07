const inBrowser = typeof window !== 'undefined'
const _toString = Object.prototype.toString

// 判断是否支持HTML5 history
export const supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})()

export const supportHistoryState = (function () {
  if (!supportsPushState) {
    return false
  }
  // 测试写操作
  history.replaceState(Object.assign({ _debug: 'ok' }, history.state), null)
  if (!history.state) {
    return false
  } else {
    let originState = Object.assign({}, history.state)
    delete originState._debug
    history.replaceState(originState, null)
    return true
  }
})()

/**
 * 生成页面主键
 */
export function genKey () {
  const t = 'xxxxxxxx'
  return t.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x'
      ? r
      : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 检测路由匹配
 * @param {Array/String/RegExp} pattern 路由主键数组/字符串/正则表达式
 * @param {String} name 路由主键
 */
export function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (pattern instanceof RegExp) {
    return pattern.test(name)
  }
  return false
}

/**
 * 获取当前url路径
 * @param {String} base | 基础路径
 * @param {String} mode | 路由模式
 */
export function getLocation (base, mode) {
  var path = window.location.pathname
  if (mode === 'hash') {
    return window.location.hash.replace(/^#\//, '')
  }
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}

/**
 * 删除数组中匹配元素
 * @param {Array} arr 数组
 * @param {String} item 需要删除的元素
 */
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 获取缓存组件实例
 * @param {Object} cache 缓存
 * @param {string} key 主键
 */
export function getCacheVnode (cache, key) {
  if (typeof key === 'string' || typeof key === 'number') {
    return getCacheVnode(cache, cache[key])
  }
  return key
}

export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

export function deepClone (val) {
  if (isPlainObject(val)) {
    const res = {}
    for (const key in val) {
      res[key] = deepClone(val[key])
    }
    return res
  } else if (Array.isArray(val)) {
    return val.slice()
  } else {
    return val
  }
}

export function defineRouteMeta (routes) {
  routes.forEach(route => {
    const meta = deepClone(route.meta)
    if (isPlainObject(route.meta)) {
      Object.defineProperty(route.meta, '_default', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: meta
      })
    }
    if (route.children) {
      defineRouteMeta(route.children)
    }
  })
}

export const urlRegExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/

function parsePath (path) {
  let hash = ''
  let query = ''

  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    pathStr: path,
    queryStr: query,
    hashStr: hash
  }
}

const genLocation = function (url) {
  const query = Object.create(null)
  const { pathStr, queryStr, hashStr } = parsePath(url)
  if (queryStr) {
    queryStr.split('&').forEach(kv => {
      const [key, val] = kv.split('=')
      query[key] = decodeURIComponent(val)
    })
  }
  return {
    path: pathStr,
    query,
    hash: hashStr
  }
}

const stringifyPrimitive = function (v) {
  switch (typeof v) {
    case 'string':
      return v
    case 'boolean':
      return v ? 'true' : 'false'
    case 'number':
      return isFinite(v) ? v : ''
    default:
      return ''
  }
}

const stringifyQuery = function (query) {
  let str = ''
  Object.keys(query).forEach((key, index) => {
    const val = query[key]
    if (index !== 0) {
      str += '&'
    }
    str += key + '=' + encodeURIComponent(stringifyPrimitive(val))
  })
  return str
}

// 解析url
export const parseUrl = function (url) {
  if (typeof url === 'string') {
    url = {
      path: url,
      query: Object.create(null)
    }
  }
  // path可能自带参数
  const { path, query } = url
  const location = genLocation(path)
  const newQuery = Object.assign({}, location.query, query)
  let queryStr = stringifyQuery(newQuery)
  queryStr = queryStr ? '?' + queryStr : ''
  return location.path + queryStr + location.hash
}
