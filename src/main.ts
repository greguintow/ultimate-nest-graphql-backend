import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@common/pipes'
import { PORT } from '@common/constants'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(PORT, () => {
    Logger.log(`Server running at: http://localhost:${PORT}/graphql`)
  })
}

bootstrap()
