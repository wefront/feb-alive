const rollup = require('rollup')
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const path = require('path')
const resolve = p => path.resolve(__dirname, '../', p)

const builds = [
  {
    file: resolve('dist/feb-alive.es.js'),
    format: 'es',
    name: '$febAlive'
  },
  {
    file: resolve('dist/feb-alive.js'),
    format: 'umd',
    name: '$febAlive'
  },
  {
    file: resolve('dist/feb-alive.browser.js'),
    format: 'iife',
    name: '$febAlive'
  },
  {
    file: resolve('dist/feb-alive.browser.min.js'),
    format: 'iife',
    name: '$febAlive'
  }
]

function genConfig(output) {
  var config = {
    input: resolve('src/index.js'),
    output,
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        exclude: '*/node_modules/**',
        runtimeHelpers: true
      })
    ]
  }
  if (/min\.js$/.test(output.file)) {
    config.plugins.push(terser())
  }
  return config
}

const buildConfigList = builds.map(v => genConfig(v))

build(buildConfigList)

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(err => {
      console.log(err)
      process.exit(1)
    })
  }

  next()
}

function buildEntry (config) {
  const output = config.output
  return rollup.rollup(config)
    .then(bundle => bundle.write(output))
}

// export default {
//   input: 'src/index.js',
//   output: [
//     {
//       file: 'dist/feb-alive.es.js',
//       format: 'es',
//       name: '$febAlive'
//     },
//     {
//       file: 'dist/feb-alive.js',
//       format: 'umd',
//       name: '$febAlive'
//     },
//     {
//       file: 'dist/feb-alive.iife.js',
//       format: 'iife',
//       name: '$febAlive'
//     }
//   ],
//   plugins: [
//     nodeResolve(),
//     commonjs(),
//     babel({
//       exclude: 'node_modules/**',
//       runtimeHelpers: true
//     })
//   ]
// }
