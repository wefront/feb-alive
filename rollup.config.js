import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/feb-alive.es.js',
      format: 'es',
      name: '$febAlive',
    },
    {
      file: 'dist/feb-alive.js',
      format: 'cjs',
      name: '$febAlive',
      exports: 'auto',
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
  ],
  external: [/core-js/, /@babel\/runtime-corejs3/],
};
