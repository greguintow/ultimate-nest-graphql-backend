import { Test } from '@nestjs/testing'
import faker from 'faker'
import { createMock } from '@golevelup/nestjs-testing'
import { PrismaService, User as PrismaUser, Prisma } from '@modules/prisma'
import { CreateUserInput } from '@modules/users/types'
import { User } from '@modules/users/models'
import { UserRepository } from '../user.repository'

const user: PrismaUser = {
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  photoUrl: faker.internet.avatar(),
  createdAt: new Date(),
  updatedAt: new Date()
}

const createUserInput: CreateUserInput = {
  name: user.name,
  email: user.email,
  password: user.password,
  photoUrl: user.photoUrl as string
}

describe('UserRepository', () => {
  let userRepository: UserRepository
  let prismaService: PrismaService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: createMock<Prisma.UserDelegate<'rejectOnNotFound'>>()
          }
        }
      ]
    }).compile()

    userRepository = await module.get(UserRepository)
    prismaService = await module.get(PrismaService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(userRepository).toBeDefined()
    expect(prismaService).toBeDefined()
  })

  describe('create', () => {
    it('should create an user successfully', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(user)

      const response = await userRepository.create(createUserInput)
      expect(response).toBeInstanceOf(User)
      expect(response).toMatchObject(user)
    })
  })

  describe('getByEmail', () => {
    it('should return null if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null)

      const response = await userRepository.getByEmail(faker.internet.email())
      expect(response).toBe(null)
    })
    it('should get the user successfully', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(user)

      const response = await userRepository.getByEmail(user.email)
      expect(response).toBeInstanceOf(User)
      expect(response?.email).toEqual(user.email)
    })
  })

  describe('existsByEmail', () => {
    it('should return false if user is not found', async () => {
      jest.spyOn(prismaService.user, 'count').mockResolvedValueOnce(0)

      const response = await userRepository.existsByEmail(faker.internet.email())
      expect(response).toBe(false)
    })
    it('should return true if the user exists', async () => {
      jest.spyOn(prismaService.user, 'count').mockResolvedValueOnce(1)

      const response = await userRepository.existsByEmail(user.email)
      expect(response).toBe(true)
    })
  })
})
