import { ValidationError, ValidationPipe as NestValidationPipe } from '@nestjs/common'
import { InvalidArgumentsError } from '@common/errors'

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      disableErrorMessages: false,
      exceptionFactory: ValidationPipe.formatErrors
    })
  }

  static formatErrors(errors: ValidationError[]) {
    return new InvalidArgumentsError({
      fields: errors.map(({ property, constraints = {} }) => ({
        name: property,
        message: Object.values(constraints),
        constraints: Object.keys(constraints).map(type => ({
          type,
          message: constraints[type]
        }))
      }))
    })
  }
}
