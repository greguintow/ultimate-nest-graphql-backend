import path from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { APP_FILTER } from '@nestjs/core'
import { ExpressContext } from 'apollo-server-express'
import { GraphQLRequestContext } from 'apollo-server-core'
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  I18nService,
  setI18nGlobalOptions
} from 'nestjs-i18n'
import { AUTH_HEADER, IN_PROD } from '@common/constants/config'
import { formatError, getUserConnection, verifyToken } from '@common/utils'
import { Context } from '@common/types'
import { DomainErrorFilter } from '@common/filters'
import { CqrsModule } from '@modules/cqrs'
import { PrismaModule } from '@modules/prisma'
import { UserModule } from '@modules/users'
import { ServicesModule } from '@modules/services'

setI18nGlobalOptions({
  method: 'middleware'
})

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    ServicesModule,
    UserModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      fallbacks: {
        'en-*': 'en',
        en: 'en',
        pt: 'pt-BR',
        'pt-*': 'pt-BR'
      },
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true
      },
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l'])
      ]
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (jwtService: JwtService, i18nService: I18nService) => {
        return {
          cors: true,
          autoSchemaFile: true,
          context: (args: ExpressContext) => {
            const token = getUserConnection(args.req.headers[AUTH_HEADER])
            const values = verifyToken(jwtService, token)
            return {
              ...args,
              ...values
            }
          },
          debug: !IN_PROD,
          formatError: async (error, _requestContext) => {
            const requestContext = _requestContext as
              | GraphQLRequestContext<Context>
              | undefined

            const lang = requestContext?.context?.req?.i18nLang || 'en'

            const defaultMessage: string = await i18nService.t('error.DEFAULT_MESSAGE', {
              lang
            })

            if (!error.extensions?.exception) {
              return {
                message: defaultMessage
              }
            }

            const { code, metadata, name, stacktrace } = error.extensions.exception

            if (!code || !name) {
              return {
                message: defaultMessage,
                extensions: {
                  stacktrace
                }
              }
            }

            const translate = async (
              key: string,
              args?: Record<string, any>
            ): Promise<string | undefined> => {
              let message: string | undefined = await i18nService.t(key, {
                lang,
                args
              })
              message = message !== key ? message : undefined
              return message
            }

            const formattedError = await formatError({
              error: {
                code,
                metadata,
                name,
                message: error.message
              },
              translate
            })

            return {
              message: formattedError.message,
              extensions: {
                code: formattedError.code,
                metadata: formattedError.metadata,
                stacktrace
              }
            }
          }
        }
      },
      inject: [JwtService, I18nService]
    })
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter
    }
  ]
})
export class AppModule {}
