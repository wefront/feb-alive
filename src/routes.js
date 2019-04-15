/**
 * 记录浏览操作历史栈
 * record history stack
 */

const inBrowser = typeof window !== 'undefined'
let routes = []
if (inBrowser) {
  window.debug_routes = routes
}
export default routes
