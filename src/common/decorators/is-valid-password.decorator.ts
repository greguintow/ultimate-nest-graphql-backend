import { applyDecorators } from '@nestjs/common'
import { IsString, Matches } from 'class-validator'
import { ErrorCode } from '@common/types'
import { createStringRequirements } from '@common/utils/regexps.util'

export function IsValidPassword() {
  return applyDecorators(
    IsString(),
    Matches(createStringRequirements(), {
      message: 'invalid_password_format' as ErrorCode
    })
  )
}
