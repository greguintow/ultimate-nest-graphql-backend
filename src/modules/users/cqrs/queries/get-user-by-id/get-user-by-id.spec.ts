import { Test } from '@nestjs/testing'
import faker from 'faker'
import { createTestUser } from '@common/test'
import { UserRepository } from '@modules/users/repositories'
import { GetUserByIdHandler } from './get-user-by-id.handler'

describe('GetUserByIdHandler', () => {
  let getUserByIdHandler: GetUserByIdHandler
  let userRepository: UserRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserByIdHandler,
        {
          provide: UserRepository,
          useValue: {
            getById: jest.fn()
          }
        }
      ]
    }).compile()

    getUserByIdHandler = await module.get(GetUserByIdHandler)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(getUserByIdHandler).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should get user', async () => {
      const userId = faker.datatype.uuid()
      const fakeUser = createTestUser({
        id: userId
      })
      jest.spyOn(userRepository, 'getById').mockResolvedValue(fakeUser)
      const user = await getUserByIdHandler.execute({ userId })
      expect(userRepository.getById).toHaveBeenCalledWith(userId)
      expect(user).toEqual(fakeUser)
    })
    it('should return null', async () => {
      const userId = faker.datatype.uuid()
      jest.spyOn(userRepository, 'getById').mockResolvedValue(null)
      const user = await getUserByIdHandler.execute({ userId })
      expect(userRepository.getById).toHaveBeenCalledWith(userId)
      expect(user).toEqual(null)
    })
  })
})
