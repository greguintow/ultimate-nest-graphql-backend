import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Test } from '@nestjs/testing'
import faker from 'faker'
import { when } from 'jest-when'
import { createTestUser } from '@modules/users/fixtures'
import { GetUserByIdQuery, LoginCommand, SignUpCommand } from '@modules/users/cqrs'
import { UserRepository } from '@modules/users/repositories'
import { UserService } from '../user.service'

const user = createTestUser()

describe('UserService', () => {
  let userService: UserService

  beforeAll(async () => {
    const executeFn = jest.fn()
    when(executeFn).calledWith(expect.any(SignUpCommand)).mockResolvedValue({ token: 'token', user })

    when(executeFn).calledWith(expect.any(LoginCommand)).mockResolvedValue({ token: 'token', user })

    when(executeFn).calledWith(expect.any(GetUserByIdQuery)).mockResolvedValue(user)

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
          provide: QueryBus,
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

  describe('getUserById', () => {
    it('should return the user', async () => {
      const res = await userService.getUserById(faker.datatype.uuid())
      expect(res).toEqual(user)
    })
  })
})
