import { DomainError } from './domain.error'

interface AuthInvalidErrorMetadata {
  field: 'email' | 'password'
}

export class AuthInvalidError extends DomainError<'auth_invalid', AuthInvalidErrorMetadata> {
  constructor(readonly metadata: AuthInvalidErrorMetadata) {
    super({
      code: 'auth_invalid',
      message: 'The email and/or password used for authentication are invalid',
      name: 'AuthInvalidError'
    })
  }
}
