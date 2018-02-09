var path = require('path');
var webpack = require('webpack');
module.exports = {
    target: 'electron',
    devtool: 'eval', //source-map
    // watch:'true',
    context: __dirname,
    entry: {
        app: './src/entry'
    },
    output: {
        path: path.resolve(__dirname, "src-app"),
        filename: './view/bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js|\.jsx?$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                options: {
                    presets: ["es2015", 'stage-0', "react"],
                    plugins: [
                        /*  ['react-transform', {
                             transforms: [{
                                 transform: 'react-transform-hmr',
                                 imports: ['react'],
                                 locals: ['module']
                             }, {
                                 transform: 'react-transform-catch-errors',
                                 imports: ['react', 'redbox-react']
                             }]
                         }], */
                        //["transform-decorators-legacy"],
                        //["transform-flow-strip-types"],  //强类型
                        ["import", { "libraryName": "antd", "style": true }]
                    ],
                },
            },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }
        ]
    },
    plugins: [
        // 配置全局常量
        new webpack.DefinePlugin(
            {
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    VERSION: JSON.stringify("0.1.0"),
                },
            }),


    ]
};