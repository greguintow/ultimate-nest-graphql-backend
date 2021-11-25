/* eslint-disable import/first */
jest.mock('class-validator', () => {
  return {
    IsUUID: jest.fn()
  }
})

import * as NestGraphQL from '@nestjs/graphql'
import * as AllValidators from 'class-validator'
import { FieldId } from '../field-id.decorator'

describe('FieldId', () => {
  it('should call field with id', () => {
    const Field = jest.spyOn(NestGraphQL, 'Field').mockImplementationOnce(() => () => {})
    const IsUUID = jest.spyOn(AllValidators, 'IsUUID').mockImplementationOnce(() => () => {})

    FieldId()

    expect(Field.mock.calls[0][0]?.()).toBe(NestGraphQL.ID)
    expect(IsUUID.mock.calls[0][1]).toEqual({ each: false })
  })
  it('should call field with [id] when passed isArray true', () => {
    const Field = jest.spyOn(NestGraphQL, 'Field').mockImplementationOnce(() => () => {})
    const IsUUID = jest.spyOn(AllValidators, 'IsUUID').mockImplementationOnce(() => () => {})

    FieldId({ isArray: true })

    expect(Field.mock.calls[0][0]?.()).toEqual([NestGraphQL.ID])
    expect(IsUUID.mock.calls[0][1]).toEqual({ each: true })
  })
})
