import { Field, ObjectType } from '@nestjs/graphql'
import { Entity } from '@common/classes'

@ObjectType()
export class User extends Entity {
  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  photoUrl?: string

  password: string
}
