/* istanbul ignore file */
import { applyDecorators } from '@nestjs/common'
import { Field, FieldOptions, ID } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'

export function FieldId(options?: FieldOptions) {
  return applyDecorators(
    Field(() => ID, options),
    IsUUID()
  )
}
