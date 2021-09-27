import { CommandBus } from '@nestjs/cqrs'
import { Test } from '@nestjs/testing'
import faker from 'faker'
import { when } from 'jest-when'
import { createTestUser } from '@common/utils'
import { LoginCommand, SignUpCommand } from '@modules/users/cqrs'
import { UserRepository } from '@modules/users/repositories'
import { UserService } from '../user.service'

const user = createTestUser()

describe('UserService', () => {
  let userService: UserService

  beforeEach(async () => {
    const executeFn = jest.fn()
    when(executeFn)
      .calledWith(expect.any(SignUpCommand))
      .mockResolvedValue({ token: 'token', user })

    when(executeFn)
      .calledWith(expect.any(LoginCommand))
      .mockResolvedValue({ token: 'token', user })

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CommandBus,
          useValue: {
            execute: executeFn
          }
        },
        {
          provide: UserRepository,
          useValue: {
            getByEmail: jest.fn().mockResolvedValue(user)
          }
        }
      ]
    }).compile()

    userService = await module.get(UserService)
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('signUp', () => {
    it('should return user login payload', async () => {
      const userLogin = await userService.signUp({
        email: faker.internet.email(),
        name: faker.name.title(),
        password: faker.internet.password()
      })
      expect(userLogin).toEqual({ user, token: 'token' })
    })
  })

  describe('login', () => {
    it('should return user login payload', async () => {
      const userLogin = await userService.login({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
      expect(userLogin).toEqual({ user, token: 'token' })
    })
  })

  describe('getUserByEmail', () => {
    it('should return the user', async () => {
      const res = await userService.getUserByEmail(faker.internet.email())
      expect(res).toEqual(user)
    })
  })
})
