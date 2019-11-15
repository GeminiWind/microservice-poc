module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: [
    '**/tests/**/*.js',
    '**/?(*.)+(test).js',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
