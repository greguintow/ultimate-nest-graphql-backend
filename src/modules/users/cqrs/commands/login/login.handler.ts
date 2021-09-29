import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AuthInvalidError } from '@common/errors'
import { CryptService } from '@modules/global-configs'
import { UserLogin } from '@modules/users/models'
import { UserRepository } from '@modules/users/repositories'
import { AuthService } from '@modules/users/services/auth.service'
import { LoginCommand } from './login.command'

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, UserLogin> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptService: CryptService,
    private readonly authService: AuthService
  ) {}

  async execute({ input: { email, password } }: LoginCommand): Promise<UserLogin> {
    const foundUser = await this.userRepository.getByEmail(email)

    if (!foundUser) {
      throw new AuthInvalidError({ field: 'email' })
    }

    const isPasswordCorrect = await this.cryptService.compare(password, foundUser.password)

    if (!isPasswordCorrect) {
      throw new AuthInvalidError({ field: 'password' })
    }

    return this.authService.getUserLoginPayload(foundUser)
  }
}
