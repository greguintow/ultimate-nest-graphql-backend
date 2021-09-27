import { Global, Module } from '@nestjs/common'
import { CqrsModule as NestCqrsModule } from '@nestjs/cqrs'

@Global()
@Module({
  imports: [NestCqrsModule],
  exports: [NestCqrsModule]
})
export class CqrsModule {}
