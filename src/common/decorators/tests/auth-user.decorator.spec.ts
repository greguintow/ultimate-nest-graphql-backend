import { ExecutionContext } from '@nestjs/common'
import faker from 'faker'
import { createMock } from '@golevelup/nestjs-testing'
import { JUser, Role } from '@common/types'
import { getParamDecoratorFactory } from '@common/utils'
import { AuthUser } from '../auth-user.decorator'

describe('AuthUser', () => {
  it('should return null', () => {
    const factory = getParamDecoratorFactory(AuthUser)
    const context = createMock<ExecutionContext>()
    context.getArgs.mockReturnValue([
      undefined,
      undefined,
      {
        user: null
      }
    ])
    const user = factory(null, context)
    expect(user).toBe(null)
  })

  it('should return user from context', () => {
    const factory = getParamDecoratorFactory(AuthUser)
    const context = createMock<ExecutionContext>()
    context.getArgs.mockReturnValue([
      undefined,
      undefined,
      {
        user: {
          email: faker.internet.email(),
          role: Role.USER
        } as JUser
      }
    ])
    const user = factory(null, context) as JUser
    expect(user.role).toBe(Role.USER)
  })
})
