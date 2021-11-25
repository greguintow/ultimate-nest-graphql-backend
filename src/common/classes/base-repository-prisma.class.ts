/* istanbul ignore file */
import { Inject, Injectable, Type } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { AllPrismaModels, AllPrismaWhereInput, PrismaTables } from '@common/types'
import { PrismaService } from '@modules/prisma'
import { BaseRepository } from './base-repository.class'

@Injectable()
export abstract class BaseRepositoryPrisma<T, U extends PrismaTables> extends BaseRepository<T> {
  @Inject()
  protected readonly prismaService: PrismaService

  constructor(protected readonly Model: Type<T>, protected readonly table: U) {
    super()
  }

  protected async exists(where?: AllPrismaWhereInput[U]): Promise<boolean> {
    // @ts-ignore
    const count = await this.prismaService[this.table].count({
      where
    })
    return count > 0
  }

  async getById(id: string): Promise<T | null> {
    // @ts-ignore
    const result = await this.prismaService[this.table].findUnique({
      where: {
        id
      }
    })
    return this.format(result)
  }

  async getByIds(ids: string[]): Promise<T[]> {
    // @ts-ignore
    const result = await this.prismaService[this.table].findMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    return this.formatMany(result)
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await this.exists({ id })
    return exists
  }

  async existsIds(ids: string[]): Promise<boolean> {
    // @ts-ignore
    const count = await this.prismaService[this.table].count({ where: { id: { in: ids } } })
    return count === ids.length
  }

  protected format<V extends AllPrismaModels[U] | null>(obj: V): V extends null ? null : T {
    if (!obj) {
      return null as V extends null ? null : T
    }

    return plainToClass(this.Model, obj) as V extends null ? null : T
  }

  protected formatMany<V extends AllPrismaModels[U]>(arr: V[]): T[] {
    if (!arr) {
      return []
    }

    return arr.map(obj => this.format(obj))
  }
}
