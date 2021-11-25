import { InitialOptionsTsJest } from 'ts-jest/dist/types'
import { pathsToModuleNameMapper } from 'ts-jest/utils'
import { compilerOptions } from './tsconfig.json'

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/src'
})

export default {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: ['**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules',
    '/constants',
    '.fixture.ts',
    '.command.ts',
    '.module.ts',
    '.event.ts',
    '.dto.ts',
    '.args.ts',
    '.query.ts',
    '.error.ts',
    'index.ts',
    '.resolver.ts',
    'test',
    'main.ts',
    '.type.ts',
    '.model.ts'
  ],
  testEnvironment: 'node',
  detectOpenHandles: true,
  coverageDirectory: './coverage',
  clearMocks: true,
  moduleNameMapper
} as InitialOptionsTsJest
