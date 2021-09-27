import { Inject, Injectable, Type } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { AllPrismaModels, AllPrismaWhereInput, PrismaTables } from '@common/types'
import { PrismaService } from '@modules/prisma'
import { BaseRepository } from './base-repository.class'

@Injectable()
export abstract class BaseRepositoryPrisma<
  T,
  U extends PrismaTables
> extends BaseRepository<T> {
  @Inject()
  protected readonly prismaService: PrismaService

  constructor(protected readonly Model: Type<T>, protected readonly table: U) {
    super()
  }

  protected async exists(where?: AllPrismaWhereInput[U]): Promise<boolean> {
    const count = await this.prismaService[this.table].count({
      where
    })
    return count > 0
  }

  protected format<V extends AllPrismaModels[U] | null>(obj: V): V extends null ? null : T {
    if (!obj) {
      return null as V extends null ? null : T
    }

    return plainToClass(this.Model, obj) as V extends null ? null : T
  }
}
