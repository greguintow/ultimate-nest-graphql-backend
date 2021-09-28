import { Test } from '@nestjs/testing'
import faker from 'faker'
import bcrypt from 'bcryptjs'
import { CryptService } from '../crypt.service'

const hashedStr = faker.datatype.string()

describe('CryptService', () => {
  let cryptService: CryptService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CryptService]
    }).compile()

    cryptService = await module.get(CryptService)
  })

  it('should be defined', () => {
    expect(cryptService).toBeDefined()
  })

  describe('encrypt', () => {
    it('should encrypt string successfully', async () => {
      const str = faker.internet.password()

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => hashedStr)
      jest.spyOn(bcrypt, 'genSalt')

      const response = await cryptService.encrypt(str)

      expect(response).toEqual(hashedStr)
      expect(bcrypt.genSalt).toBeCalledWith(5)
    })
  })

  describe('compare', () => {
    it('should compare string successfully', async () => {
      const str = faker.internet.password()

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => true)

      const response = await cryptService.compare(str, hashedStr)

      expect(response).toBe(true)
    })
  })
})
