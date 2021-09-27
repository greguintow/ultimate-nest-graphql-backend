import { ErrorCode } from '@common/types'

export interface DomainErrorParams<Err extends ErrorCode> {
  message: string
  name: string
  code: Err
}

export class DomainError<
  Err extends ErrorCode,
  TMetadata extends Record<string, any> | undefined = undefined
> extends Error {
  readonly metadata?: TMetadata

  readonly name: string

  readonly code: Err

  constructor({ message, name, code }: DomainErrorParams<Err>) {
    super(message)

    this.name = name
    this.code = code
  }
}
