import { sleep } from '../utils'

export const getJoke = function ({ page = 1, pagesize = 10}) {
  const mock = []
  for (let i = 0; i < pagesize; i++) {
    mock.push({
      content: `我是第${page}页文章标题${i + 1}`
    })
  }
  return sleep(500).then(() => {
    return mock
  })
}
