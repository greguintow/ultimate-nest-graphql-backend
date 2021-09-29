import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ObjectAlreadyExistsError } from '@common/errors'
import { CryptService } from '@modules/global-configs'
import { UserLogin } from '@modules/users/models'
import { UserRepository } from '@modules/users/repositories'
import { AuthService } from '@modules/users/services/auth.service'
import { SignUpCommand } from './sign-up.command'

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand, UserLogin> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptService: CryptService,
    private readonly authService: AuthService
  ) {}

  async execute({ input }: SignUpCommand): Promise<UserLogin> {
    const existsUser = await this.userRepository.existsByEmail(input.email)
    if (existsUser) {
      throw new ObjectAlreadyExistsError({
        field: 'email',
        objectType: 'User'
      })
    }

    const hashedPassword = await this.cryptService.encrypt(input.password)

    const user = await this.userRepository.create({
      ...input,
      password: hashedPassword
    })

    return this.authService.getUserLoginPayload(user)
  }
}
