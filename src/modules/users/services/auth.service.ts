import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JUser, Role } from '@common/types'
import { User, UserLogin } from '../models'

export interface GetUserFromTokenResponse {
  user: JUser | null
  isTokenInvalid: boolean
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateUserToken(user: User) {
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
      return { user: null, isTokenInvalid: false }
    }
    try {
      const user = this.jwtService.verify(token)
      return { user: user ?? null, isTokenInvalid: false }
    } catch (err) {
      return { user: null, isTokenInvalid: true }
    }
  }

  getUserConnection(authHeader: string | string[] | undefined): string | null {
    try {
      if (!authHeader) return null
      const token = this.getBearerToken(authHeader)
      return token
    } catch {
      return null
    }
  }

  getBearerToken(authHeader: string | string[]): string {
    return authHeader?.toString().split('Bearer ')[1]
  }

  getTokenFromHeader(authHeader: string | string[] | undefined): GetUserFromTokenResponse {
    const token = this.getUserConnection(authHeader)
    return this.verifyToken(token)
  }
}
