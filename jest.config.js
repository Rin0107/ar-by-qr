module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/app/js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};
