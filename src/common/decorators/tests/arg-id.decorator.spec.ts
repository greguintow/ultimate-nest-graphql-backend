import * as NestGraphQL from '@nestjs/graphql'
import { ID } from '@nestjs/graphql'
import { ArgId } from '../arg-id.decorator'

describe('ArgId', () => {
  it('should call args with id', () => {
    const spy = jest.spyOn(NestGraphQL, 'Args').mockImplementationOnce(() => () => {})

    ArgId('userId')({}, 'test', 0)

    expect(spy.mock.calls[0][0]).toBe('userId')
    expect(spy.mock.calls[0][1].type?.()).toBe(ID)
  })
  it('should call args as [id] when isArray true', () => {
    const spy = jest.spyOn(NestGraphQL, 'Args').mockImplementationOnce(() => () => {})

    ArgId('userId', { isArray: true })({}, 'test', 0)

    expect(spy.mock.calls[0][0]).toBe('userId')
    expect(spy.mock.calls[0][1].type?.()).toEqual([ID])
  })
})
