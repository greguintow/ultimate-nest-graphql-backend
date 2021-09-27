import { LoginDto } from '@modules/users/dto'

export class LoginCommand {
  constructor(public readonly input: LoginDto) {}
}
