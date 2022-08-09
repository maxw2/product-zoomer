import typescript from 'rollup-plugin-typescript'
import postcss from 'rollup-plugin-postcss'
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
      postcss()
    ], 
  };