import { Global, Module } from '@nestjs/common'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'
import { SECRET } from '@common/constants/config'
import { CryptService } from './crypt.service'

export const jwtModule = NestJwtModule.register({
  secret: SECRET,
  signOptions: {
    expiresIn: '7d',
    issuer: 'ACME',
    noTimestamp: false
  }
})

@Global()
@Module({
  imports: [jwtModule],
  providers: [CryptService],
  exports: [jwtModule, CryptService]
})
export class ServicesModule {}
