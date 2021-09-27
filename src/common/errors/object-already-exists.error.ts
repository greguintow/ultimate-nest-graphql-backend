import { ObjectType } from '@common/types'
import { DomainError } from './domain.error'

interface ObjectAlreadyExistsErrorMetadata {
  objectType: ObjectType
  field: string
}

export class ObjectAlreadyExistsError extends DomainError<
  'object_already_exists',
  ObjectAlreadyExistsErrorMetadata
> {
  constructor(readonly metadata: ObjectAlreadyExistsErrorMetadata) {
    super({
      name: 'ObjectAlreadyExistsError',
      code: 'object_already_exists',
      message: `The ${metadata.objectType} with its specified ${metadata.field} already exists`
    })
  }
}
