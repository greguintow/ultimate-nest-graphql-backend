import { Injectable } from '@nestjs/common'
import { BaseRepositoryPrisma } from '@common/classes'
import { User } from '../models'
import { CreateUserInput } from '../types'

@Injectable()
export class UserRepository extends BaseRepositoryPrisma<User, 'user'> {
  constructor() {
    super(User, 'user')
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = await this.prismaService.user.create({ data: input })
    return this.format(user)
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email }
    })
    return this.format(user)
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.exists({ email })
  }
}
