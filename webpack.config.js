const path = require("path");

module.exports = {
    watch: true,
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ProductZoomer.js'
    },
    module:{
        rules: [{
            test: /\.ts?$/,
            exclude: /node_modules/,
            use: 'ts-loader'
        },{
            // 增加对 SCSS 文件的支持
            test: /\.scss$/,
            // SCSS 文件的处理顺序为先 sass-loader 再 css-loader 再 style-loader
            use: ['style-loader', 'css-loader', 'sass-loader'],
        }]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src')
        },
        extensions: ['.tsx', '.ts', '.js', '.json']
    }
}