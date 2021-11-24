/* istanbul ignore file */

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import { Role } from '@common/types'

export const TEST_ROLE = 'TEST' as Role

export function getParamDecoratorFactory(decorator: Function) {
  class TestDecorator {
    public test(@decorator() _value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test')
  return args[Object.keys(args)[0]].factory
}
