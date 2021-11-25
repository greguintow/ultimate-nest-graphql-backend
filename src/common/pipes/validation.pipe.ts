import { ValidationPipe as NestValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { InvalidArgumentsError } from '@common/errors'

interface ValidationErrorConstraints extends ValidationError {
  constraints: {
    [type: string]: string
  }
}

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      disableErrorMessages: false,
      exceptionFactory: ValidationPipe.formatErrors
    })
  }

  static formatErrors(errors: ValidationError[]) {
    const allErrors = ValidationPipe.getAllErrors(errors)

    return new InvalidArgumentsError({
      fields: allErrors.map(({ property, constraints }) => ({
        name: property,
        message: Object.values(constraints),
        constraints: Object.keys(constraints).map(type => ({
          type,
          message: constraints[type]
        }))
      }))
    })
  }

  static getAllErrors(errors: ValidationError[], parentKey?: string): ValidationErrorConstraints[] {
    return errors
      .reduce((arr, error) => {
        const newKey = parentKey ? `${parentKey}.${error.property}` : error.property
        error.property = newKey

        if (error.children && error.children.length > 0) {
          return [...arr, error, ...ValidationPipe.getAllErrors(error.children, error.property)]
        }

        return [...arr, error]
      }, [] as ValidationError[])
      .filter(error => error.constraints) as ValidationErrorConstraints[]
  }
}
