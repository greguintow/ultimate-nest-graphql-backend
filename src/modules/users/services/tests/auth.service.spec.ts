import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { createTestUser } from '@common/utils'
import { JUser, Role } from '@common/types'
import { jwtModule } from '@modules/global-configs'
import { AuthService } from '../auth.service'

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [jwtModule],
      providers: [AuthService]
    }).compile()

    authService = await module.get(AuthService)
    jwtService = await module.get(JwtService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
    expect(jwtService).toBeDefined()
  })

  describe('generateUserToken', () => {
    it('should return the token successfully', () => {
      const user = createTestUser()
      const token = authService.generateUserToken(user)
      const decodedToken = jwtService.decode(token) as JUser
      expect(decodedToken.role).toBe(Role.USER)
      expect(decodedToken.sub).toBe(user.id)
    })
  })

  describe('getUserLoginPayload', () => {
    it('should return the user login payload successfully', () => {
      const user = createTestUser()
      const { token, user: resUser } = authService.getUserLoginPayload(user)
      expect(token).toBeTruthy()
      expect(user).toEqual(resUser)
    })
  })

  describe('verifyToken', () => {
    it('should return isTokenInvalid false with no user', () => {
      const token = null
      const { isTokenInvalid, user } = authService.verifyToken(token)
      expect(isTokenInvalid).toBe(false)
      expect(user).toBe(null)
    })
    it('should return isTokenInvalid true', () => {
      const token = 'anytoken'
      const { isTokenInvalid, user } = authService.verifyToken(token)
      expect(isTokenInvalid).toBe(true)
      expect(user).toBe(null)
    })
    it('should return payload successfully', () => {
      const user = createTestUser()
      const token = authService.generateUserToken(user)
      const { isTokenInvalid, user: resUser } = authService.verifyToken(token)
      expect(isTokenInvalid).toBe(false)
      expect(resUser).toBeTruthy()
    })
  })

  describe('getUserConnection', () => {
    it('should return null if token invalid', () => {
      const token = authService.getUserConnection('anything')
      expect(token).toBe(null)
    })
    it('should return null if no token is passed', () => {
      jest.spyOn(authService, 'getBearerToken')
      const token = authService.getUserConnection(undefined)
      expect(authService.getBearerToken).toBeCalledTimes(0)
      expect(token).toBe(null)
    })
    it('should return null if getBearerToken fails', () => {
      jest.spyOn(authService, 'getBearerToken').mockImplementation(() => {
        throw new Error('generic error')
      })
      const token = authService.getUserConnection('something')
      expect(authService.getBearerToken).toThrowError()
      expect(token).toBe(null)
    })
    it('should return the token', () => {
      const token = authService.getBearerToken('Bearer something')
      expect(token).toBe('something')
    })
  })

  describe('getBearerToken', () => {
    it('should return undefined if wasnt able to get the token', () => {
      jest.spyOn(authService, 'getBearerToken')
      const response = authService.getBearerToken('anything')
      expect(response).toBeUndefined()
    })
    it('should return the token', () => {
      const token = authService.getBearerToken('Bearer something')
      expect(token).toBe('something')
    })
  })

  describe('getTokenFromHeader', () => {
    it('should return the payload from header', () => {
      const user = createTestUser()
      const token = authService.generateUserToken(user)
      const res = authService.getTokenFromHeader(`Bearer ${token}`)
      expect(res.user).toBeTruthy()
      expect(res.isTokenInvalid).toBe(false)
    })
    it('should not return a successful payload', () => {
      const res = authService.getTokenFromHeader('any')
      expect(res).toEqual({ user: null, isTokenInvalid: false })
    })
    it('should return isTokenInvalid true', () => {
      const res = authService.getTokenFromHeader('Bearer something')
      expect(res).toEqual({ user: null, isTokenInvalid: true })
    })
  })
})
