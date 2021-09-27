import { ExpressContext } from 'apollo-server-express'
import { Request } from 'express'

export enum Role {
  USER = 'USER',
  OTHER = 'OTHER'
}

export interface JUser {
  iss: string
  email: string
  id: string
  /**
   * User Id
   */
  sub: string
  iat: number
  exp: number
  role: Role
}

export interface Context extends ExpressContext {
  req: Request & { i18nLang?: string }
  user?: JUser | null
  isTokenInvalid: boolean
  i18nLang?: string
}
