import { Provider } from '@nestjs/common'
import { isFunction } from '@common/utils'

export * from './sign-up'
export * from './login'

export const CommandHandlers = Object.values(exports).filter(
  handler => isFunction(handler) && /handler/i.test(handler.name)
) as Provider[]
