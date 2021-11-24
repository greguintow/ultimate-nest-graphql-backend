import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import faker from 'faker'
import { Role } from '@common/types'
import { SECRET } from '@common/constants'
import { PrismaService } from '@modules/prisma'
import { UserLogin } from '@modules/users/models'
import { AppModule } from '../src/app.module'
import { GET_USER, LOGIN_USER, SIGN_UP_USER } from './queries'

const gql = '/graphql'

const loginInput = {
  email: 'testing@testing.com',
  password: '@Test123'
}

const signUpInput = {
  ...loginInput,
  name: 'Test User'
}

describe('UserResolver (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userLogin: UserLogin
  let request: () => supertest.Test

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    prisma = app.get(PrismaService)
    request = () => supertest(app.getHttpServer()).post(gql)

    const result = await request().send({
      query: SIGN_UP_USER,
      variables: {
        input: signUpInput
      }
    })
    userLogin = result.body?.data?.signUp
  })

  afterAll(async () => {
    await prisma.user.deleteMany()

    await app.close()
  })

  describe('me', () => {
    it('should return the user successfully', () => {
      return request()
        .send({ query: GET_USER })
        .set('Authorization', `Bearer ${userLogin.token}`)
        .expect(200)
        .expect(res => {
          expect(res.body.data.me).toEqual(userLogin.user)
        })
    })
    it('should return token is invalid', () => {
      return request()
        .send({ query: GET_USER })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('errors.0.extensions.code', 'invalid_token')
          expect(res.body).toHaveProperty('errors.0.extensions.metadata.status', 'invalid')
        })
    })
    it('should return token is expired', () => {
      const { user } = userLogin
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: Role.USER,
          exp: faker.date.past().getTime() / 1000
        },
        SECRET
      )
      return request()
        .send({ query: GET_USER })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('errors.0.extensions.code', 'invalid_token')
          expect(res.body).toHaveProperty('errors.0.extensions.metadata.status', 'expired')
        })
    })
  })

  describe('login', () => {
    it('should login successfully', () => {
      return request()
        .send({ query: LOGIN_USER, variables: { input: loginInput } })
        .expect(200)
        .expect(res => {
          expect(res.body.data.login.user).toEqual(userLogin.user)
        })
    })
    it('should return auth invalid in email field', () => {
      return request()
        .send({
          query: LOGIN_USER,
          variables: {
            input: {
              ...loginInput,
              email: 'other@other.com'
            }
          }
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('errors.0.extensions.code', 'auth_invalid')
          expect(res.body).toHaveProperty('errors.0.extensions.metadata.field', 'email')
        })
    })
    it('should return auth invalid in password field', () => {
      return request()
        .send({
          query: LOGIN_USER,
          variables: {
            input: {
              ...loginInput,
              password: 'something'
            }
          }
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('errors.0.extensions.code', 'auth_invalid')
          expect(res.body).toHaveProperty('errors.0.extensions.metadata.field', 'password')
        })
    })
  })

  describe('signUp', () => {
    it('should sign up a new user successfully', () => {
      const newSignUpInput = {
        name: 'Something else',
        email: 'something@something.com',
        password: '@Test123'
      }
      return request()
        .send({
          query: SIGN_UP_USER,
          variables: {
            input: newSignUpInput
          }
        })
        .expect(200)
        .expect(res => {
          const { password, ...rest } = newSignUpInput
          expect(res.body.data.signUp.user).toMatchObject(rest)
        })
    })
    it('should return object already exists error', () => {
      return request()
        .send({
          query: SIGN_UP_USER,
          variables: {
            input: signUpInput
          }
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('errors.0.extensions.code', 'object_already_exists')
          expect(res.body).toHaveProperty('errors.0.extensions.metadata.field', 'email')
        })
    })
  })
})
