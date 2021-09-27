import { DomainError } from './domain.error'

interface InvalidArgumentsErrorMetadata {
  error?: string
  fields?: {
    name: string
    message: string[]
    constraints: {
      type: string
      message: string
    }[]
  }[]
}

export class InvalidArgumentsError extends DomainError<
  'invalid_arguments',
  InvalidArgumentsErrorMetadata
> {
  constructor(readonly metadata?: InvalidArgumentsErrorMetadata) {
    super({
      message: 'Invalid argument(s) were provided',
      name: 'InvalidArgumentsError',
      code: 'invalid_arguments'
    })
  }
}
