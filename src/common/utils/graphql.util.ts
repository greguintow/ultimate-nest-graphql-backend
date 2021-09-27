import { JwtService } from '@nestjs/jwt'
import { JUser } from '@common/types'

export const getBearerToken = (authHeader: string | string[]): string => {
  return authHeader?.toString().split('Bearer ')[1]
}

export const getUserConnection = (
  authHeader: string | string[] | undefined
): string | null => {
  try {
    if (!authHeader) return null
    const token = getBearerToken(authHeader)
    return token
  } catch {
    return null
  }
}

export const verifyToken = (
  jwtService: JwtService,
  token: string | null
): { user: JUser | null; isTokenInvalid: boolean } => {
  if (!token) {
    return { user: null, isTokenInvalid: false }
  }
  try {
    const user = jwtService.verify(token)
    return { user: user ?? null, isTokenInvalid: false }
  } catch (err) {
    return { user: null, isTokenInvalid: true }
  }
}
