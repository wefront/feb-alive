/**
 * 记录feb-alive中的缓存列表
 */

const inBrowser = typeof window !== 'undefined'
let cache = Object.create(null)
if (inBrowser) {
  window.debug_cache = cache
}
export default cache
