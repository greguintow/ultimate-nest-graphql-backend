import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PageInfo } from './page-info.model'

@ObjectType()
export abstract class PaginatedList<T> {
  @Field(() => PageInfo)
  pageInfo: PageInfo

  @Field(() => Int)
  count: number

  abstract items: T[]
}
