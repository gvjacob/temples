module.exports = {
  moduleDirectories: ['node_modules'],

  moduleFileExtensions: ['js'],

  rootDir: '.',

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.cache/', '/dist/'],

  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },

  transformIgnorePatterns: ['/node_modules/'],

  collectCoverage: false,
  collectCoverageFrom: ['./src/**/*.js', '!**/node_modules/**'],

  verbose: true,
};

