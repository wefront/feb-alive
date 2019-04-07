export const sleep = function (delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
