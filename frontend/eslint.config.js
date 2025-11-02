import { defineConfig } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'

export default defineConfig([
  reactHooks.configs.flat['recommended-latest'],
  {
    ignores: ['dist/**', 'build/**'],
  },
	{
    rules: {
      semi: ['error', 'never', { beforeStatementContinuationChars: 'always' }],
      'prefer-const': 'error',
    },
  },
])
