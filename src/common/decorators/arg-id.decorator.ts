import { Args, ArgsOptions, ID } from '@nestjs/graphql'

export interface ArgsIdOptions extends ArgsOptions {
  isArray?: boolean
}

export function ArgId(argName: string, options?: ArgsIdOptions): ParameterDecorator {
  return (target, key, index) => {
    Args(argName, { ...options, type: () => (options?.isArray ? [ID] : ID) })(target, key, index)
  }
}
