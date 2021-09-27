import { getCqrsHandlers } from '@common/utils'

export * from './sign-up'
export * from './login'

export const CommandHandlers = getCqrsHandlers(exports)
