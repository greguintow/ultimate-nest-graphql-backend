import { ValidationPipe as NestValidationPipe, ArgumentMetadata } from '@nestjs/common'
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

  public async transform(value: any, metadata: ArgumentMetadata) {
    await super.transform(value, metadata)

    return value
  }
}
