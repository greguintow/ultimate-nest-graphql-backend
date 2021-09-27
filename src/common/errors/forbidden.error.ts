import { DomainError } from './domain.error'

export class ForbiddenError extends DomainError<'forbidden'> {
  constructor() {
    super({
      name: 'Forbidden',
      code: 'forbidden',
      message: 'You are not authorized to perform this action'
    })
  }
}
