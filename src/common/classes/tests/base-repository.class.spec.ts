import { plainToClass } from 'class-transformer'
import faker from 'faker'
import { BaseRepository } from '../base-repository.class'

class Test {
  id: string
}

describe('BaseRepository', () => {
  class TestRepository extends BaseRepository<Test> {
    defaultPage = this.defaultPage

    defaultPageSize = this.defaultPageSize

    getPage = super.getPage.bind(this)

    getPageSize = super.getPageSize.bind(this)

    createPaginationPayload = super.createPaginationPayload.bind(this)

    getPaginationOffset = super.getPaginationOffset.bind(this)
  }

  const testRepository = new TestRepository()

  describe('getPage', () => {
    it('should return 1 (default page) in case no page is provided', () => {
      expect(testRepository.getPage()).toBe(1)
    })
    it('should return 1 (default page) in case a page is less than 1', () => {
      expect(testRepository.getPage(-2)).toBe(testRepository.defaultPage)
    })
    it('should return provided page', () => {
      expect(testRepository.getPage(2)).toBe(2)
    })
  })

  describe('getPageSize', () => {
    it('should return default page size if no one was provided', () => {
      expect(testRepository.getPageSize()).toBe(10)
    })
    it('should return 10 (default page size) in case page size is less than 1', () => {
      expect(testRepository.getPageSize(-2)).toBe(testRepository.defaultPageSize)
    })
    it('should return provided page size', () => {
      expect(testRepository.getPageSize(15)).toBe(15)
    })
  })

  describe('getPaginationOffset', () => {
    it('should return pagination offset 0 in case page was not provided', () => {
      expect(testRepository.getPaginationOffset({ page: 0, pageSize: 10 })).toBe(0)
    })
    it('should return 10 if page=2 and pageSize=10', () => {
      expect(testRepository.getPaginationOffset({ page: 2, pageSize: 10 })).toBe(10)
    })
  })

  describe('createPaginationPayload', () => {
    it('should return correct pagination payload', () => {
      const data = [
        plainToClass(Test, {
          id: 'randomId'
        })
      ]
      const paginationPayload = testRepository.createPaginationPayload({
        data,
        page: 1,
        pageSize: 10,
        count: 1
      })
      expect(paginationPayload).toEqual({
        count: 1,
        items: data,
        pageInfo: {
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          itemCount: 1,
          perPage: 10,
          pageCount: 1
        }
      })
    })
    it('should return hasPreviousPage', () => {
      const data = faker.datatype
        .array(20)
        .map(() => plainToClass(Test, { id: faker.datatype.uuid() }))

      const paginationPayload = testRepository.createPaginationPayload({
        data,
        page: 2,
        pageSize: 10,
        count: 20
      })
      expect(paginationPayload).toEqual({
        count: 20,
        items: data,
        pageInfo: {
          currentPage: 2,
          hasNextPage: false,
          hasPreviousPage: true,
          itemCount: 20,
          perPage: 10,
          pageCount: 2
        }
      })
    })
  })
})
