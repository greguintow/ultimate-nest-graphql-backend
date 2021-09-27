import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { GqlArgumentsHost } from '@nestjs/graphql'
import { DomainError } from '@common/errors'

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError<any, any>, host: ArgumentsHost) {
    GqlArgumentsHost.create(host)
    return exception
  }
}
