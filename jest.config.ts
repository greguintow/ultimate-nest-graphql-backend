import type { Config } from '@jest/types'
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
  coveragePathIgnorePatterns: [
    '/node_modules',
    '.fixture.ts',
    '.command.ts',
    '.event.ts',
    '.dto.ts',
    '.query.ts',
    '.error.ts'
  ],
  testEnvironment: 'node',
  collectCoverage: true,
  detectOpenHandles: true,
  coverageDirectory: './coverage',
  clearMocks: true,
  moduleNameMapper
} as Config.InitialOptions
