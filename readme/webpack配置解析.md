### Webpack 基础配置解析

---

#### 1. 基本框架  
> * entry定义入口文件
> * output 定义出口文件
> * resolve 是nodeJs内置函数，需要`const {resolve} = require('path');`引入后，用于解析path
> * __dirname是nodeJs内置变量，用于定位当前文件的绝对路径
> * mudule中的rules定义一个数组，用于添加需要用到的loader
> * plugins是一个数组，用于添加需要使用的插件
> * mode定义运行环境，开发环境为'development',生产环境为'production'
> * devServer 定义开发服务器，创建一个前端服务器，监听代码变化，自动打包并运行代码
```javascript
module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'app.js',
        path: resolve(__dirname, 'dist'),
    },
    module: {
        rules: [],
    },
    plugins: [],
    mode: 'production',
    devServer: {
        contentBase: './dist', // 发布目录
        compress: true, // 是否启用gzip压缩
        post: 8888, // 定于开发服务器的端口号
    },
};
```
#### 2. 基础配置信息
> ##### 使用到的插件
> * mini-css-extract-plugin 插件可以把样式资源提取成单独的css文件并使用<link>标签导入html页面
> * optimize-css-assets-webpack-plugin插件会压缩CSS文件
> * postcss-preset-env 做兼容性处理，自动兼容老版本浏览器，
>需要在项目配置文件package.json中配置需要兼容的brawserslist。如下就是开发环境
>适配最新版本的浏览器。生产环境则适配99.9%的浏览器，且排除停止开发和op_mini浏览器
> * html-webpack-plugin webpack只处理js文件，使用这个插件可以配置一个HTML模板，并压缩HTML代码
>##### 使用到的loader
>###### CSS使用到的
> * less-loader负责把less样式文件编译成css文件
> * postcss-loader负责使用postcss-preset-env 插件做兼容性处理
> * css-loader 负责引入CSS文件到JS中，因为webpack默认只会打包js文件
> * MiniCssExtractPlugin.loader 与mini-css-extract-plugin抽取出样式资源为独立打包文件
>```json5
>  "browserslist": {
>     "development": [
>       "last 1 versions"
>     ],
>     "production": [
>       ">0.1%",
>       "not dead",
>       "not op_mini all"
>     ]
>   }
>```
>###### 引入静态资源文件使用的url-loader
>如果在样式活html中引入的静态资源（图片、字体、多媒体.....），编译后是不会自动打包到编译目录的，需要使用url-loader引入静态资源
>HTML中引用静态资源还需要使用html-loader
>###### 使用babel-loader兼容ES5
>babel-loader可以把ES6代码转成ES5代码，以便兼容老旧的浏览器
>###### 使用eslint-loader进行语法检查
>eslint-loader可以检查js文件中的不规范语法，一般使用airbnb-base 的eslint规则实现代码的风格统一
>
>
```javascript
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
const CommonCssLoader = [MiniCssExtractPlugin.loader,
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
    output: {
        filename: 'app.js',
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
                    name: 'imgs/[name].[hash:7].[ext]',
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
            filename: 'app.css',
        }),
        new OptimizeCssAssetsWebpackPlugin(),
    ],
    mode: 'production',
    // 开发服务器配置
    devServer: {
        contentBase: resolve('dist'),
        conpress: true,
        port: 8888,
    },
};
```
