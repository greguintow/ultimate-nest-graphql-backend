import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { LoginCommand, SignUpCommand } from '../cqrs'
import { LoginDto, SignUpDto } from '../dto'
import { UserLogin } from '../models'
import { UserRepository } from '../repositories'

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userRepository: UserRepository
  ) {}

  signUp(input: SignUpDto): Promise<UserLogin> {
    return this.commandBus.execute<SignUpCommand, UserLogin>(new SignUpCommand(input))
  }

  login(input: LoginDto): Promise<UserLogin> {
    return this.commandBus.execute<LoginCommand, UserLogin>(new LoginCommand(input))
  }

  getUserByEmail = this.userRepository.getByEmail.bind(this.userRepository)
}
