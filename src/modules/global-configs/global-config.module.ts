import { Global, Module, ModuleMetadata, Provider } from '@nestjs/common'
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'
import { SECRET } from '@common/constants/config'
import * as Services from './services'

export const jwtModule = NestJwtModule.register({
  secret: SECRET,
  signOptions: {
    expiresIn: '7d',
    issuer: 'ACME',
    noTimestamp: false
  }
})

type ModuleType = NonNullable<ModuleMetadata['imports']>

const exposedModules: ModuleType = [NestCqrsModule, jwtModule]
const exposedProviders: Provider[] = [...Object.values(Services)]

@Global()
@Module({
  imports: [...exposedModules],
  providers: [...exposedProviders],
  exports: [...exposedModules, ...exposedProviders]
})
export class GlobalConfigModule {}
