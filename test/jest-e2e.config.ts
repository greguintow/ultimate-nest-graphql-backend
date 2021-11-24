import { InitialOptionsTsJest } from 'ts-jest/dist/types'
import { pathsToModuleNameMapper } from 'ts-jest/utils'
import { compilerOptions } from '../tsconfig.json'

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/src'
})

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules',
    '/constants',
    '.fixture.ts',
    '.module.ts',
    'index.ts',
    '.spec.ts',
    'main.ts',
    '.type.ts',
    '/test'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper,
  coverageDirectory: './coverage-e2e'
} as InitialOptionsTsJest
