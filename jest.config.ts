module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  // ESM-only packages: faker v10 and cuid2 v3 — transform their .js files via babel-jest
  transformIgnorePatterns: ['node_modules/(?!@faker-js|@paralleldrive|@noble)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!dist/**/*',
    '!src/config.ts',
    // This is really all boilerplate for Drizzle
    '!src/db/index.ts',
    // Might want to include these in the future but should be okay for now
    '!src/passport/**/*',
    // Just the logger setup
    '!src/utils/logger.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFiles: ['<rootDir>/tests/jest.setup.ts'],
}
