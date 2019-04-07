import assert from 'power-assert'
import { parseUrl } from '../src/utils'

describe('parseUrl [string] 无查询参数测试', function() {
  const url = 'https://wy.guahao.com'
  it(`${url} ===> ${parseUrl(url)}`, function() {
    assert(parseUrl(url) === encodeURI(url))
  })
})

describe('parseUrl [string] 查询参数英文测试', function() {
  const url = 'https://wy.guahao.com?age=1&name=wedoctor'
  it(`${url} ===> ${parseUrl(url)}`, function() {
    assert(parseUrl(url) === encodeURI(url))
  })
})

describe('parseUrl [string] 查询参数中文测试', function() {
  const url = 'https://wy.guahao.com?age=1&name=微医'
  it(`${url} ===> ${parseUrl(url)}`, function() {
    assert(parseUrl(url) === encodeURI(url))
  })
})

describe('parseUrl [string] hash参数测试', function() {
  const url = 'https://wy.guahao.com?age=1#c1'
  it(`${url} ===> ${parseUrl(url)}`, function() {
    assert(parseUrl(url) === encodeURI(url))
  })
})

describe('parseUrl [object] 无查询参数测试', function() {
  const url = {
    path: 'https://wy.guahao.com',
    query: {}
  }
  const equalPath = 'https://wy.guahao.com'
  it(`${JSON.stringify(url)} ===> ${encodeURI(equalPath)}`, function() {
    assert(parseUrl(url) === encodeURI(equalPath))
  })
})


describe('parseUrl [object] 查询参数英文测试', function() {
  const url = {
    path: 'https://wy.guahao.com',
    query: {
      age: '1',
      name: 'wedoctor'
    }
  }
  const equalPath = 'https://wy.guahao.com?age=1&name=wedoctor'
  it(`${JSON.stringify(url)} ===> ${encodeURI(equalPath)}`, function() {
    assert(parseUrl(url) === encodeURI(equalPath))
  })
})

describe('parseUrl [object] 查询参数中文测试', function() {
  const url = {
    path: 'https://wy.guahao.com',
    query: {
      age: '1',
      name: '微医'
    }
  }
  const equalPath = 'https://wy.guahao.com?age=1&name=微医'
  it(`${JSON.stringify(url)} ===> ${encodeURI(equalPath)}`, function() {
    assert(parseUrl(url) === encodeURI(equalPath))
  })
})

describe('parseUrl [object] 查询参数冗余测试', function() {
  const url = {
    path: 'https://wy.guahao.com?age=22',
    query: {
      age: '1',
      name: '微医'
    }
  }
  const equalPath = 'https://wy.guahao.com?age=1&name=微医'
  it(`${JSON.stringify(url)} ===> ${encodeURI(equalPath)}`, function() {
    assert(parseUrl(url) === encodeURI(equalPath))
  })
})
