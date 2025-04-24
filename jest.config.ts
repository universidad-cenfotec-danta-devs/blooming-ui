import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions }         from './tsconfig.json';

const tsPaths = (compilerOptions as any).paths ?? {};

export default {
  /* ─────────────────────────────
   * Let the preset register Zone,
   * AsyncHooks   and TestBed once
   * ──────────────────────────── */
  preset          : 'jest-preset-angular',
  testEnvironment : 'jsdom',


  /** Move ts-jest config to “transform” */
  transform : {
    '^.+\\.(ts|mjs|html)$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },

  /* Map TS path-aliases, if you have any */
  moduleNameMapper : pathsToModuleNameMapper(tsPaths, { prefix: '<rootDir>/' }),

  /* Allow modern *.mjs packages */
  transformIgnorePatterns : ['node_modules/(?!.*\\.mjs$)'],
};
