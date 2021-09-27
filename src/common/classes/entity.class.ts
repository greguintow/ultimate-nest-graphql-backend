import { Field, ObjectType } from '@nestjs/graphql'
import { FieldId } from '@common/decorators'

@ObjectType()
export class Entity {
  @FieldId()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
