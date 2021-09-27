import { SetMetadata } from '@nestjs/common'
import { Role } from '@common/types'

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)
