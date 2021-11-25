import { applyDecorators } from '@nestjs/common'
import { Field, FieldOptions, ID } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'

export interface FieldIdOptions extends FieldOptions {
  isArray?: boolean
}

export function FieldId({ isArray = false, ...options }: FieldIdOptions = {}) {
  return applyDecorators(
    Field(() => (isArray ? [ID] : ID), options),
    IsUUID(undefined, { each: isArray })
  )
}
