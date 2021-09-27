import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@common/pipes'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })

  app.useGlobalPipes(new ValidationPipe())

  const port = process.env.PORT || 5005

  await app.listen(port, () => {
    Logger.log(`Server running at: http://localhost:${port}/graphql`)
  })
}

bootstrap()
