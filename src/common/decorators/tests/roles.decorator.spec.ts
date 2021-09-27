/* eslint-disable max-classes-per-file */
import { Role } from '@common/types'
import { Roles } from '../roles.decorator'

describe('Roles', () => {
  @Roles(Role.OTHER)
  class Test {}

  class TestWithMethod {
    @Roles(Role.USER)
    public static test() {}
  }

  it('should enhance class with expected role', () => {
    const metadata = Reflect.getMetadata('roles', Test)
    expect(metadata).toEqual([Role.OTHER])
  })
  it('should enhance method with expected role', () => {
    const metadata = Reflect.getMetadata('roles', TestWithMethod.test)
    expect(metadata).toEqual([Role.USER])
  })
})
