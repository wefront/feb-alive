/**
 * 记录浏览历史
 */

const inBrowser = typeof window !== 'undefined'
let routes = []
if (inBrowser) {
  window.debug_routes = routes
}
export default routes
