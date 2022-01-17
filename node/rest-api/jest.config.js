module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(js|jsx|ts|tsx)',
    '**/?(*.)+(spec|test).+(js|jsx|ts|tsx)',
  ],
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/jest/mocks/svg.js',
    '^.+\\.(png|jpg)$': '<rootDir>/jest/mocks/file.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
