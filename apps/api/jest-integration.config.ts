import type { Config } from 'jest';

const config: Config = {
  displayName: {
    name: 'INTEGRATION',
    color: 'blue',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  testMatch: ['**/*.integration-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  coverageDirectory: './coverage/integration',
  coverageReporters: ['html'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup-integration.ts'],
};

export default config;
