import { DomainError } from './domain.error'

export class UnauthenticatedError extends DomainError<'unauthenticated'> {
  constructor() {
    super({
      name: 'Unauthenticated',
      code: 'unauthenticated',
      message: 'You need to be authenticated to perform this action'
    })
  }
}
