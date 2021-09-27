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
