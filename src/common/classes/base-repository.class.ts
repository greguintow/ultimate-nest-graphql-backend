import { PaginatedList } from '@common/models'
import { PaginationParams } from '@common/types'

interface CreatePaginatedListPayload<T> {
  page: number
  pageSize: number
  /**
   * total of items in the query
   */
  count: number
  data: T[]
}

export abstract class BaseRepository<T> {
  protected defaultPage = 1

  protected defaultPageSize = 10

  protected getPage(page?: number): number {
    return page ? (page < 1 ? this.defaultPage : page) : this.defaultPage
  }

  protected getPageSize(pageSize?: number): number {
    return pageSize ? (pageSize < 1 ? this.defaultPageSize : pageSize) : this.defaultPageSize
  }

  protected createPaginationPayload({
    data,
    page: _page,
    pageSize: _pageSize,
    count
  }: CreatePaginatedListPayload<T>): PaginatedList<T> {
    const pageSize = this.getPageSize(_pageSize)
    const page = this.getPage(_page)
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
