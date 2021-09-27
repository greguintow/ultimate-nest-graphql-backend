import { PrismaClient, Prisma } from '@modules/prisma'

export type Obj = { [key: string]: any }

export type RemoveNeverProperties<T> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends never ? K : never
  }[keyof T]
>

export type GetDelegate<T> = RemoveNeverProperties<
  {
    [K in keyof T]: T[K] extends { [key: string]: any }
      ? T[K]['findUnique'] extends (...args: any[]) => any
        ? K
        : never
      : never
  }
>

export type RequiredNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>
}

export type PrismaTables = keyof GetDelegate<PrismaClient>

export type GetModelType<T extends PrismaTables> = ReturnType<
  PrismaClient[T]['create']
> extends Prisma.Prisma__UserClient<infer U>
  ? U
  : never

type UnpackSubset<T> = T extends Prisma.Subset<infer _U, infer V> ? V : T

export type GetWhereInput<T extends PrismaTables> = NonNullable<
  NonNullable<UnpackSubset<Parameters<PrismaClient[T]['count']>[0]>>['where']
>

export type AllPrismaModels = {
  [K in PrismaTables]: GetModelType<K>
}

export type AllPrismaWhereInput = {
  [K in PrismaTables]: GetWhereInput<K>
}

export type $Values<T extends Obj> = T[keyof T]
