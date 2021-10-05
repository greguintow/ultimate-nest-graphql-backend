import { ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Reflector } from '@nestjs/core'
import { createMock } from '@golevelup/nestjs-testing'
import faker from 'faker'
import { InvalidTokenError, UnauthenticatedError, ForbiddenError } from '@common/errors'
import { Context, JUser, Role } from '@common/types'
import { TEST_ROLE } from '@common/utils'
import { AuthGuard } from '../auth.guard'

describe('AuthGuard', () => {
  let guard: AuthGuard
  let reflector: Reflector

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthGuard]
    }).compile()

    guard = await module.get(AuthGuard)
    reflector = await module.get(Reflector)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
    expect(reflector).toBeDefined()
  })

  it('should throw an error if token is invalid', async () => {
    const context = createMock<ExecutionContext>()
    context.getArgs.mockReturnValue([
      undefined,
      undefined,
      { tokenStatus: 'invalid' } as Partial<Context>
    ])
    await expect(guard.canActivate(context)).rejects.toThrow(InvalidTokenError)
  })

  it('should throw an error if user is not found', async () => {
    const context = createMock<ExecutionContext>()
    context.getArgs.mockReturnValue([undefined, undefined, {}])
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthenticatedError)
  })

  it('should throw an error if user doesnt have the right role', async () => {
    const context = createMock<ExecutionContext>()
    context.getArgs.mockReturnValue([
      undefined,
      undefined,
      {
        user: {
          email: faker.internet.email(),
          role: TEST_ROLE
        } as JUser
      }
    ])
    jest.spyOn(reflector, 'get').mockReturnValue([Role.USER])
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenError)
  })

  it('should return true with auth if no role was defined', async () => {
    const context = createMock<ExecutionContext>()
    context.getArgs.mockReturnValue([
      undefined,
      undefined,
      {
        user: {
          email: faker.internet.email(),
          role: TEST_ROLE
        } as JUser
      }
    ])
    await expect(guard.canActivate(context)).toBeTruthy()
  })

  it('should return true with auth specifying the role', async () => {
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
    jest.spyOn(reflector, 'get').mockReturnValue([Role.USER])
    await expect(guard.canActivate(context)).toBeTruthy()
  })
})
