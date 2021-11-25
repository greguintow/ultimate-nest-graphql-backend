/* istanbul ignore file */
import { applyDecorators } from '@nestjs/common'
import { IsString, Matches } from 'class-validator'
import { ErrorCode } from '@common/types'
import { createStringRequirements } from '@common/utils'

/**
 * Regex to check if string has at least 8 characters and at least one symbol, number, uppercase and lowercase char
 */
export const defaultPasswordConstraints = createStringRequirements()

export function isValidPassword(value: any) {
  return defaultPasswordConstraints.test(value)
}

export function IsValidPassword() {
  return applyDecorators(
    IsString(),
    Matches(defaultPasswordConstraints, {
      message: 'invalid_password_format' as ErrorCode
    })
  )
}
