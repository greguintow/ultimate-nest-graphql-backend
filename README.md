## Description

**Features**
- NodeJS
- TypeScript
- NestJS
- Express
- Docker (with multi stage image)
- GraphQL
- Internationalization (I18n)
- Prisma
- PostgreSQL
- Jest (Unit, E2E tests)
- CQRS
- 100% coverage
- Stripe errors like
- Husky
- Lint-staged
- Eslint
- Prettier
- Bulletproof validation
- GitHub Actions
  - CI when open pull request, runs:
    - Tests (unit and e2e)
    - Lint repo (eslint)
  - Superlinter: it can be manually dispatched in the actions tab

## Requirements
- Docker
- Nodejs (>=12.22 or >=14.17 or >=16)

## Installation

```bash
$ yarn
$ yarn init:dev
```

## Running the app

```bash
# development
$ yarn dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

**100% coverage**

![image](https://user-images.githubusercontent.com/30958574/143388449-b3421a1f-9801-4fc0-aca7-0edd09f6e370.png)
