import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { ForbiddenError, InvalidTokenError, UnauthenticatedError } from '@common/errors'
import { Context, Role } from '../types'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<Context>()

    const { user, tokenStatus } = ctx

    if (tokenStatus && tokenStatus !== 'valid') {
      throw new InvalidTokenError({
        status: tokenStatus
      })
    }

    if (!user) throw new UnauthenticatedError()

    const roles = this.reflector.get<Role[]>('roles', context.getHandler())

    if (!roles) return true

    if (!roles.includes(user.role)) {
      throw new ForbiddenError()
    }

    return true
  }
}
