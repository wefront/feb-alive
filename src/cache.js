/**
 * 记录页面缓存
 * record page cache
 */

const inBrowser = typeof window !== 'undefined';
const cache = Object.create(null);
if (inBrowser) {
  window.debug_cache = cache;
}
export default cache;
