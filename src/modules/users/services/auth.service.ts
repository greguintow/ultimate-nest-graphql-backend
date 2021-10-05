import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TokenExpiredError } from 'jsonwebtoken'
import { JUser, Role, TokenStatus } from '@common/types'
import { User, UserLogin } from '../models'

export interface GetUserFromTokenResponse {
  user: JUser | null
  tokenStatus: TokenStatus
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateUserToken(user: User): string {
    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        role: Role.USER
      },
      { subject: user.id }
    )
    return token
  }

  getUserLoginPayload(user: User): UserLogin {
    const token = this.generateUserToken(user)

    return { token, user }
  }

  verifyToken(token: string | null): GetUserFromTokenResponse {
    if (!token) {
      return { user: null, tokenStatus: 'invalid' }
    }
    try {
      const user = this.jwtService.verify(token)
      return { user, tokenStatus: 'valid' }
    } catch (err) {
      let tokenStatus: TokenStatus = 'invalid'
      if (err instanceof TokenExpiredError) {
        tokenStatus = 'expired'
      }
      return { user: null, tokenStatus }
    }
  }

  getUserConnection(authHeader: string | string[] | undefined): string | null {
    try {
      if (!authHeader) return null
      const token = this.getBearerToken(authHeader)
      return token ?? null
    } catch {
      return null
    }
  }

  getBearerToken(authHeader: string | string[]): string | undefined {
    return authHeader.toString().split('Bearer ')[1]
  }

  getTokenFromHeader(authHeader: string | string[] | undefined): GetUserFromTokenResponse {
    const token = this.getUserConnection(authHeader)
    return this.verifyToken(token)
  }
}
