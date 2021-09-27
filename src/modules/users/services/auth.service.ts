import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Role } from '@common/types'
import { User, UserLogin } from '../models'

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
}
