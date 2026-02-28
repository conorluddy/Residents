module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  // @faker-js/faker v10 is ESM-only; tell Jest to transform it via ts-jest
  transformIgnorePatterns: ['node_modules/(?!@faker-js)'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: { allowJs: true } }],
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
