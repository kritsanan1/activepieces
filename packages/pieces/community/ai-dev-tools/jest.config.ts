module.exports = {
  displayName: 'pieces-ai-dev-tools',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/packages/pieces/community/ai-dev-tools',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
};