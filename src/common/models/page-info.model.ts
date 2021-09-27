import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  currentPage: number

  @Field(() => Int)
  perPage: number

  @Field(() => Int)
  itemCount: number

  @Field(() => Int)
  pageCount: number

  @Field()
  hasNextPage: boolean

  @Field()
  hasPreviousPage: boolean
}
