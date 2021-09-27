import { Field, ObjectType } from '@nestjs/graphql'
import { User } from './user.model'

@ObjectType()
export class UserLogin {
  @Field()
  token: string

  @Field(() => User)
  user: User
}
