import typescript from 'rollup-plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import image from '@rollup/plugin-image';
// import nodeResolve from 'rollup-plugin-node-resolve'

export default {
    input: 'index.js',
    output: [{
      file: 'dist/bundle.js',
      format: 'cjs'
    },{
      file: "dist/bundle.esm.js",
      format: "es",
    },{
      file: "dist/bundle.iife.js",
      format: "iife",
    }],
    plugins: [
      typescript({
        exclude: "node_modules/**",
        typescript: require("typescript"),
      }),
      postcss(),
      image()
      // nodeResolve(
      //   {
      //     jsnext: true,
      //     main: true
      //   }
      // ),
    ], 
  };