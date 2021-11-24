import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { LoginCommand, SignUpCommand, GetUserByIdQuery } from '../cqrs'
import { LoginDto, SignUpDto } from '../dto'
import { UserLogin, User } from '../models'

@Injectable()
export class UserService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  signUp(input: SignUpDto): Promise<UserLogin> {
    return this.commandBus.execute<SignUpCommand, UserLogin>(new SignUpCommand(input))
  }

  login(input: LoginDto): Promise<UserLogin> {
    return this.commandBus.execute<LoginCommand, UserLogin>(new LoginCommand(input))
  }

  getUserById(userId: string): Promise<User> {
    return this.queryBus.execute<GetUserByIdQuery, User>(new GetUserByIdQuery(userId))
  }
}
