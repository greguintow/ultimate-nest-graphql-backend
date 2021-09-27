import { SignUpDto } from '@modules/users/dto'

export class SignUpCommand {
  constructor(public readonly input: SignUpDto) {}
}
