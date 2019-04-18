import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/feb-alive.es.js',
      format: 'es',
      name: '$febAlive'
    },
    {
      file: 'dist/feb-alive.js',
      format: 'umd',
      name: '$febAlive'
    },
    {
      file: 'dist/feb-alive.iife.js',
      format: 'iife',
      name: '$febAlive'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    })
  ]
}
