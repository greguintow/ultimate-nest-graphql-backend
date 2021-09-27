import { Module } from '@nestjs/common'
import { UserResolver } from './resolvers'
import { AuthService, UserService } from './services'
import { UserRepository } from './repositories'
import { CommandHandlers } from './cqrs'

@Module({
  providers: [UserRepository, AuthService, UserService, UserResolver, ...CommandHandlers]
})
export class UserModule {}
