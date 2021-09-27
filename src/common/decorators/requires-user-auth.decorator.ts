import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@common/guards'
import { Role } from '@common/types'
import { Roles } from './roles.decorator'

export function RequiresUserAuth() {
  return applyDecorators(Roles(Role.USER), UseGuards(AuthGuard))
}
