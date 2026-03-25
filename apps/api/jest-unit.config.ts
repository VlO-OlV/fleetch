import type { Config } from 'jest';

const config: Config = {
  displayName: {
    name: 'UNIT',
    color: 'yellow',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  coverageDirectory: './coverage/unit',
  coverageReporters: ['html'],
  testEnvironment: 'node',
};

export default config;
