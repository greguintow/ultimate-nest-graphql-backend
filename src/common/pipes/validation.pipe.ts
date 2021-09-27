import { ValidationPipe as NestValidationPipe } from '@nestjs/common'
import { InvalidArgumentsError } from '@common/errors'

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      disableErrorMessages: false,
      exceptionFactory: errors => {
        return new InvalidArgumentsError({
          fields: errors.map(({ property, constraints }) => ({
            name: property,
            message: !constraints ? [] : Object.values(constraints),
            constraints: !constraints
              ? []
              : Object.keys(constraints).map(type => ({
                  type,
                  message: constraints[type]
                }))
          }))
        })
      }
    })
  }
}
