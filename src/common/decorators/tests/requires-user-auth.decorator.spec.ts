import { GUARDS_METADATA } from '@nestjs/common/constants'
import { AuthGuard } from '@common/guards'
import { Role } from '@common/types'
import { RequiresUserAuth } from '../requires-user-auth.decorator'

describe('RequiresUserAuth', () => {
  class TestWithMethod {
    @RequiresUserAuth()
    public test() {
      return true
    }
  }

  it('should be using the guard defined on the prototype method and with the user role', () => {
    const instance = new TestWithMethod()

    const methodMetadata = Reflect.getMetadata(GUARDS_METADATA, instance.test)
    const metadata = Reflect.getMetadata('roles', instance.test)

    expect(methodMetadata).toEqual([AuthGuard])
    expect(metadata).toEqual([Role.USER])
  })
})
