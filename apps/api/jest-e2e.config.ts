import type { Config } from 'jest';

const config: Config = {
  displayName: {
    name: 'E2E',
    color: 'magenta',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './test',
  testMatch: ['**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  coverageDirectory: './coverage/e2e',
  coverageReporters: ['html'],
  testEnvironment: 'node',
};

export default config;
