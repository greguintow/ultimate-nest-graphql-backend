import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UserRepository } from '@modules/users/repositories'
import { User } from '@modules/users/models'
import { GetUserByIdQuery } from './get-user-by-id.query'

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery, User | null> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: GetUserByIdQuery): Promise<User | null> {
    const user = await this.userRepository.getById(userId)
    return user
  }
}
