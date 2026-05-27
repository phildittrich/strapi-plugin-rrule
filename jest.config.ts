import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/__tests__/**/*.(test|spec).ts?(x)'],
  setupFilesAfterEnv: ['./admin/src/test-setup.ts'],
  moduleNameMapper: {
    '^@strapi/design-system$': '<rootDir>/admin/src/__mocks__/@strapi/design-system.tsx',
    '^styled-components$': '<rootDir>/admin/src/__mocks__/styled-components.tsx',
  },
};

export default config;
