import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthUser, RequiresUserAuth } from '@common/decorators'
import { JUser } from '@common/types'
import { LoginDto, SignUpDto } from '../dto'
import { User, UserLogin } from '../models'
import { UserService } from '../services'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @RequiresUserAuth()
  me(@AuthUser() user: JUser) {
    return this.userService.getUserById(user.id)
  }

  @Mutation(() => UserLogin)
  signUp(@Args('input') input: SignUpDto) {
    return this.userService.signUp(input)
  }

  @Mutation(() => UserLogin)
  login(@Args('input') input: LoginDto) {
    return this.userService.login(input)
  }
}
