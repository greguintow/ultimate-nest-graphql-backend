import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import faker from 'faker'
import { ObjectAlreadyExistsError } from '@common/errors'
import { JUser, Role } from '@common/types'
import { createTestUser } from '@modules/users/fixtures'
import { CryptService, jwtModule } from '@modules/global-configs'
import { UserRepository } from '@modules/users/repositories'
import { AuthService } from '@modules/users/services'
import { SignUpCommand } from './sign-up.command'
import { SignUpHandler } from './sign-up.handler'

const signUpInput: SignUpCommand['input'] = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.datatype.string()
}

const hashedPassword = faker.datatype.string()
const user = createTestUser({
  ...signUpInput,
  password: hashedPassword
})

describe('SignUpHandler', () => {
  let signUpHandler: SignUpHandler
  let userRepository: UserRepository
  let cryptService: CryptService
  let authService: AuthService
  let jwtService: JwtService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [jwtModule],
      providers: [
        SignUpHandler,
        {
          provide: UserRepository,
          useValue: {
            existsByEmail: jest.fn(),
            create: jest.fn()
          }
        },
        {
          provide: CryptService,
          useValue: {
            encrypt: jest.fn().mockResolvedValue(hashedPassword)
          }
        },
        AuthService
      ]
    }).compile()

    signUpHandler = await module.get(SignUpHandler)
    userRepository = await module.get(UserRepository)
    cryptService = await module.get(CryptService)
    authService = await module.get(AuthService)
    jwtService = await module.get(JwtService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(signUpHandler).toBeDefined()
    expect(userRepository).toBeDefined()
    expect(cryptService).toBeDefined()
    expect(authService).toBeDefined()
    expect(jwtService).toBeDefined()
  })

  describe('execute', () => {
    it('should throw an error if already exists an user with the email', async () => {
      jest.spyOn(userRepository, 'existsByEmail').mockResolvedValueOnce(true)
      jest.spyOn(userRepository, 'create')

      const promise = signUpHandler.execute(new SignUpCommand(signUpInput))
      await expect(promise).rejects.toThrow(ObjectAlreadyExistsError)
      await expect(promise).rejects.toHaveProperty('metadata.field', 'email')
      await expect(promise).rejects.toHaveProperty('metadata.objectType', 'User')
      expect(userRepository.existsByEmail).toBeCalledWith(signUpInput.email)
      expect(userRepository.create).not.toBeCalled()
    })
    it('should create an user successfully', async () => {
      jest.spyOn(userRepository, 'existsByEmail').mockResolvedValueOnce(false)
      jest.spyOn(userRepository, 'create').mockResolvedValueOnce(user)
      jest.spyOn(cryptService, 'encrypt').mockResolvedValueOnce(hashedPassword)

      const response = await signUpHandler.execute(new SignUpCommand(signUpInput))
      const decodedToken = jwtService.decode(response.token) as JUser
      expect(decodedToken.role).toBe(Role.USER)
      expect(decodedToken.sub).toBe(response.user.id)
      expect(response.user).toMatchObject(user)
      expect(response.user.password).toBe(hashedPassword)
    })
  })
})
