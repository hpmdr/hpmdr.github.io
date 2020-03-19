/*
* webpack配置 提要
* 样式处理、提取、压缩  html模板、压缩 js压缩 图片 其他资源
* 各种插件、loader，可以去npmjs.com查看其readme，用法
*
* 输出文件可以使用hash值来命名文件，避免缓存，hash值的获取方法为[hash:位数]
* hash值又三种，第一种是[hash]，是整个项目的hash
* 第二种是[chunkhash]，是根据chunk来分别打包的hash
* 第三种是[contenthash]，是源文件的hash
*
* */

const {resolve} = require('path');
// html插件，用于指定html模板入口文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// mini css 提取插件，内置一个loader 用于提取出入口js import的css样式作为单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 用于压缩css样式的插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// postcss-loader插件，用于转换css的兼容性,需要在package.json中配置需要兼容的浏览器
const PostcssPresetEnv = require('postcss-preset-env');

// 复用CSS loader
const CommonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: () => [PostcssPresetEnv(/* pluginOptions */)],
        },
    }];

module.exports = {
    entry: './src/app.js',
    output: {// contenthash是当前代码的hash值
        filename: 'js/[name].[hash:7].js',
        path: resolve(__dirname, 'dist'),
    },

    module: {
        // loader配置
        rules: [
            // css loader配置
            {
                test: /\.css$/,
                use: [...CommonCssLoader],
            },
            {
                test: /\.less$/,
                use: [...CommonCssLoader, 'less-loader'],
            },
            // 引入图片资源
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 8192,
                    name: 'imgs/[name].[contenthash:7].[ext]',
                },
            },
            // 处理html文件中引用的静态资源
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            // 使用babel-loader，把js代码转换为 ES5
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    cacheDirectory: true, // 开启babel缓存，不用每次都编译所有js文件
                },
            },
            // 使用 eslint-loader进行语法检查
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    fix: true,
                },
            },
        ],
    },
    // 插件配置
    plugins: [
        // html插件，指定一个html模板
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'css/app.[contenthash:7].css',
        }),
        new OptimizeCssAssetsWebpackPlugin(),
    ],
    mode: 'production',
    // 开发服务器配置
    devServer: {
        contentBase: resolve('dist'),
        compress: true,
        port: 8888,
        open: false,
    },
    devtool: 'eval-cheap-module-source-map',
};
