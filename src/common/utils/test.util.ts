import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import faker from 'faker'
import { plainToClass } from 'class-transformer'
import { User } from '@modules/users/models'

export const createTestUser = (params?: Partial<User>): User => {
  return plainToClass(User, {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    photoUrl: faker.internet.avatar(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...params
  })
}

export function getParamDecoratorFactory(decorator: Function) {
  class TestDecorator {
    public test(@decorator() _value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test')
  return args[Object.keys(args)[0]].factory
}
