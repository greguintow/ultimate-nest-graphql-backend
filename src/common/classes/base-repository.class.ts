import { PaginatedList } from '@common/models'
import { PaginationParams } from '@common/types'

interface CreatePaginatedListPayload<T> {
  page: number
  pageSize: number
  count: number
  data: T[]
}

export class BaseRepository<T> {
  protected defaultPage = 1

  protected defaultPageSize = 10

  protected getPage(page?: number): number {
    return page ? (page < 1 ? this.defaultPage : page) : this.defaultPage
  }

  protected getPageSize(pageSize?: number): number {
    return pageSize || this.defaultPageSize
  }

  protected createPaginationPayload({
    data,
    page,
    pageSize,
    count
  }: CreatePaginatedListPayload<T>): PaginatedList<T> {
    const pageCount = Math.ceil(count / pageSize)
    return {
      count,
      items: data,
      pageInfo: {
        currentPage: pageCount,
        hasNextPage: page < pageCount,
        hasPreviousPage: (pageCount > 1 && page > 1) || page === pageCount + 1,
        itemCount: count,
        perPage: pageSize,
        pageCount
      }
    }
  }

  protected getPaginationOffset({ page, pageSize }: PaginationParams): number {
    return !page ? 0 : (page - 1) * pageSize
  }
}
