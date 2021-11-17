import { getCqrsHandlers } from '@common/utils'

export * from './get-user-by-id'

export const QueryHandlers = getCqrsHandlers(exports)
