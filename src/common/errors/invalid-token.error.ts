import { DomainError } from './domain.error'

export class InvalidTokenError extends DomainError<'invalid_token'> {
  constructor() {
    super({
      name: 'InvalidToken',
      code: 'invalid_token',
      message: 'The provided token is invalid'
    })
  }
}
