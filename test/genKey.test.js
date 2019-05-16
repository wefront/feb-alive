import assert from 'power-assert'
import { genKey } from '../src/utils'

describe('genKey 随机数测试', function() {
  it(`genKey should gen string of len 8`, function() {
    assert(genKey().length === 8)
  })
})