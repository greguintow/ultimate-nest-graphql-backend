import { ObjectAlreadyExistsError } from './object-already-exists.error'
import { InvalidArgumentsError } from './invalid-arguments.error'
import { AuthInvalidError } from './auth-invalid.error'
import { UnauthenticatedError } from './unauthenticated.error'
import { InvalidTokenError } from './invalid-token.error'
import { ForbiddenError } from './forbidden.error'

export * from './object-already-exists.error'
export * from './invalid-arguments.error'
export * from './auth-invalid.error'
export * from './unauthenticated.error'
export * from './invalid-token.error'
export * from './forbidden.error'
export * from './domain.error'

export interface AllErrors {
  ObjectAlreadyExistsError: ObjectAlreadyExistsError
  InvalidArgumentsError: InvalidArgumentsError
  AuthInvalidError: AuthInvalidError
  UnauthenticatedError: UnauthenticatedError
  InvalidTokenError: InvalidTokenError
  ForbiddenError: ForbiddenError
}
