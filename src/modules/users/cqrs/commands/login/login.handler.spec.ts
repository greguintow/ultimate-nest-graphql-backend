import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import faker from 'faker'
import { createTestUser } from '@common/utils'
import { AuthInvalidError } from '@common/errors'
import { JUser, Role } from '@common/types'
import { CryptService, jwtModule } from '@modules/global-configs'
import { UserRepository } from '@modules/users/repositories'
import { AuthService } from '@modules/users/services'
import { LoginCommand } from './login.command'
import { LoginHandler } from './login.handler'

const loginInput: LoginCommand['input'] = {
  email: faker.internet.email(),
  password: faker.datatype.string()
}

const hashedPassword = faker.datatype.string()
const user = createTestUser({
  ...loginInput,
  password: hashedPassword
})

describe('LoginHandler', () => {
  let loginHandler: LoginHandler
  let userRepository: UserRepository
  let cryptService: CryptService
  let authService: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [jwtModule],
      providers: [
        LoginHandler,
        {
          provide: UserRepository,
          useValue: {
            getByEmail: jest.fn()
          }
        },
        {
          provide: CryptService,
          useValue: {
            compare: jest.fn()
          }
        },
        AuthService
      ]
    }).compile()

    loginHandler = await module.get(LoginHandler)
    userRepository = await module.get(UserRepository)
    cryptService = await module.get(CryptService)
    authService = await module.get(AuthService)
    jwtService = await module.get(JwtService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(loginHandler).toBeDefined()
    expect(userRepository).toBeDefined()
    expect(cryptService).toBeDefined()
    expect(authService).toBeDefined()
    expect(jwtService).toBeDefined()
  })

  describe('execute', () => {
    it('should throw an error if account doesnt exists', async () => {
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(null)
      jest.spyOn(cryptService, 'compare')

      const promise = loginHandler.execute(new LoginCommand(loginInput))
      await expect(promise).rejects.toThrow(AuthInvalidError)
      await expect(promise).rejects.toHaveProperty('metadata.field', 'email')
      expect(userRepository.getByEmail).toBeCalledWith(loginInput.email)
      expect(cryptService.compare).not.toBeCalled()
    })
    it('should throw an error if password is wrong', async () => {
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(user)
      jest.spyOn(cryptService, 'compare').mockResolvedValueOnce(false)

      const promise = loginHandler.execute(new LoginCommand(loginInput))
      await expect(promise).rejects.toThrow(AuthInvalidError)
      await expect(promise).rejects.toHaveProperty('metadata.field', 'password')
      expect(userRepository.getByEmail).toBeCalledWith(loginInput.email)
      expect(cryptService.compare).toBeCalledWith(loginInput.password, user.password)
    })
    it('should return the login payload successfully', async () => {
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValueOnce(user)
      jest.spyOn(cryptService, 'compare').mockResolvedValueOnce(true)

      const response = await loginHandler.execute(new LoginCommand(loginInput))
      const decodedToken = jwtService.decode(response.token) as JUser
      expect(decodedToken.role).toBe(Role.USER)
      expect(decodedToken.sub).toBe(response.user.id)
      expect(response.user).toMatchObject(user)
      expect(response.user.password).toBe(hashedPassword)
    })
  })
})
