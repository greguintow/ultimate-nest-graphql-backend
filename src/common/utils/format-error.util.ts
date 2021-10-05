/* istanbul ignore file */

import { AllErrors } from '@common/errors'

type Errors = AllErrors[keyof AllErrors]

export interface FormatErrorParams {
  translate: (key: string, args?: Record<string, any>) => Promise<string | undefined>
  error: Errors
}

export async function formatError({
  error,
  translate
}: FormatErrorParams): Promise<Errors> {
  const defaultMessage =
    (await translate(`error.${error.code}`, error.metadata)) || error.message
  switch (error.code) {
    case 'object_already_exists':
      if (error.metadata.field === 'email' && error.metadata.objectType === 'User') {
        const message = await translate('error.email_in_use')
        return {
          ...error,
          message: message || defaultMessage
        }
      }
      return {
        ...error,
        message: defaultMessage
      }
    case 'invalid_arguments':
      const fields = await Promise.all(
        !error.metadata?.fields
          ? []
          : error.metadata?.fields.map(async field => {
              return {
                ...field,
                message: await Promise.all(
                  field.message.map(async message =>
                    message.includes(' ')
                      ? message
                      : (await translate(`error.${message}`)) || message
                  )
                )
              }
            })
      )
      return {
        ...error,
        message: defaultMessage,
        metadata: {
          ...error.metadata,
          fields
        }
      }
    case 'auth_invalid':
      if (error.metadata.field === 'email') {
        const message = await translate('error.account_not_found')
        return {
          ...error,
          message: message || defaultMessage
        }
      }
      if (error.metadata.field === 'password') {
        const message = await translate('error.invalid_password')
        return {
          ...error,
          message: message || defaultMessage
        }
      }
      return error
    case 'invalid_token':
      const message = await translate(`error.invalid_token.${error.metadata.status}`)
      return {
        ...error,
        message: message || defaultMessage
      }
    default:
      return {
        ...error,
        message: defaultMessage
      } as Errors
  }
}
