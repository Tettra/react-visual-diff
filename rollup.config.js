import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup';
import url from 'rollup-plugin-url'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
    cleanup()
  ],
  external: ['lodash', 'diff', 'deep-diff', 'react', 'jsondiffpatch', 'flatten', 'lodash/pick', 'flatted/esm', 'lodash/get', 'lodash/set', 'lodash/flatten', 'react-is']
}
