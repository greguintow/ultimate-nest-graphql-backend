import { ArgumentsHost } from '@nestjs/common'
import { GqlArgumentsHost } from '@nestjs/graphql'
import { createMock } from '@golevelup/nestjs-testing'
import { UnauthenticatedError } from '@common/errors'
import { DomainErrorFilter } from '../domain-error.filter'

describe('DomainErrorFilter', () => {
  const domainErrorFilter = new DomainErrorFilter()

  describe('catch', () => {
    it('should return domain error', () => {
      const host = createMock<ArgumentsHost>()
      jest.spyOn(GqlArgumentsHost, 'create')
      host.getType.mockReturnValue('graphql')
      host.getArgs.mockReturnValue([])
      const error = domainErrorFilter.catch(new UnauthenticatedError(), host)
      expect(GqlArgumentsHost.create).toBeCalledWith(host)
      expect(error).toBeInstanceOf(UnauthenticatedError)
    })
  })
})
