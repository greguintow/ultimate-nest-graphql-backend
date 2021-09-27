import path from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
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
import { formatError } from '@common/utils'
import { Context } from '@common/types'
import { DomainErrorFilter } from '@common/filters'
import { InvalidArgumentsError } from '@common/errors'
import { CqrsModule } from '@modules/cqrs'
import { PrismaModule } from '@modules/prisma'
import { UserModule } from '@modules/users'
import { ServicesModule } from '@modules/services'
import { AuthService } from '@modules/users/services'

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
      imports: [UserModule],
      useFactory: async (authService: AuthService, i18nService: I18nService) => {
        return {
          cors: true,
          autoSchemaFile: true,
          context: (args: ExpressContext) => {
            const values = authService.getTokenFromHeader(args.req.headers[AUTH_HEADER])
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

            if (error.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
              const { locations } = error
              if (locations) {
                const [{ line, column }] = locations
                const sourceLine = requestContext?.source?.split('\n')[line - 1] as string
                let foundColon = 0
                let foundChar = -1
                for (let i = column - 2; i > 0; i--) {
                  const element = sourceLine[i]
                  if (element === ':') {
                    foundColon = i
                  }
                  if (i < foundColon && element !== ' ') {
                    foundChar = i + 1
                    break
                  }
                }
                if (foundChar > -1) {
                  const fieldArr = sourceLine.slice(0, foundChar).split(' ')
                  const field = fieldArr[fieldArr.length - 1].match(/[A-Za-z0-9]+/g)?.[0]
                  if (field) {
                    const expectedType = error.message.split(' ')[0]
                    const message = [
                      await translate(`error.invalid_${expectedType.toLowerCase()}`)
                    ].filter(Boolean) as string[]

                    const formattedError = await formatError({
                      error: new InvalidArgumentsError({
                        fields: [
                          {
                            name: field,
                            constraints: [],
                            message
                          }
                        ]
                      }),
                      translate
                    })
                    return {
                      message: formattedError.message,
                      extensions: {
                        code: formattedError.code,
                        metadata: formattedError.metadata,
                        stacktrace: error.extensions.exception.stacktrace
                      }
                    }
                  }
                }
              }

              return {
                message: defaultMessage,
                extensions: {
                  stacktrace: error.extensions.exception.stacktrace
                }
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
      inject: [AuthService, I18nService]
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
