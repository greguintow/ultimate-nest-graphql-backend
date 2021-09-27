import { Test } from '@nestjs/testing'
import faker from 'faker'
import { CryptService } from '../crypt.service'

describe('CryptService', () => {
  let cryptService: CryptService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CryptService]
    }).compile()

    cryptService = await module.get(CryptService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(cryptService).toBeDefined()
  })

  describe('encrypt', () => {
    it('should encrypt string successfully', async () => {
      const str = faker.internet.password()
      const hashedStr = faker.datatype.string()

      jest.spyOn(cryptService, 'encrypt').mockResolvedValueOnce(hashedStr)

      const response = await cryptService.encrypt(str)

      expect(response).toBeDefined()
      expect(response).toEqual(hashedStr)
    })
  })

  describe('compare', () => {
    it('should compare string successfully', async () => {
      const str = faker.internet.password()
      const hashedStr = faker.datatype.string()

      jest.spyOn(cryptService, 'compare').mockResolvedValueOnce(true)

      const response = await cryptService.compare(str, hashedStr)

      expect(response).toBeDefined()
      expect(response).toBeTruthy()
    })
  })
})
