import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { PORT } from '@common/constants'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })

  await app.listen(PORT, () => {
    Logger.log(`Server running at: http://localhost:${PORT}/graphql`)
  })
}

bootstrap()
