import { globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const nextConfig = [
  ...nextVitals,
  ...nextTypescript,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    settings: {
      'import/extensions': ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'] },
        typescript: { extensions: ['.ts', '.tsx'] },
      },
    },
  },
];

export default nextConfig;
