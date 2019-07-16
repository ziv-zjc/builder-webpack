const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 打包日志 提示优化 成功 失败（错误堆栈，及解决方案） 警告（文件过大等）
const autoprefixer = require('autoprefixer');

const projectRoot = process.cwd()   //调用时候目录 替换__dirname

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            const match = entryFile.match(/src\/(.*)\/index\.js/);
            const pageName = match && match[1];
            entry[pageName] = entryFile;
            return htmlWebpackPlugins.push(
                new HtmlWebpackPlugin({ // html压缩，可以配置多个
                    template: path.join(projectRoot, `src/${pageName}/index.html`), // 模板所在位置 可以使用ejs语法
                    filename: `${pageName}.html`, // 指定打包出来文件名称
                    chunks: ['vendors', 'commons', pageName], // 指定生成的html要使用哪些chunk；设置inject为true时，打包后生成的css、js会自动注入到html中
                    inject: true,
                    minify: {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false,
                    },

                }),
            );
        });
    return {
        entry,
        htmlWebpackPlugins,
    };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    entry,
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                'babel-loader',
            ],
        },
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader, // style-loader与此loader不能同时使用  此load可以将css分离成单独文件
                // 'style-loader', //node执行顺序是从右到左，因此先执行cssloader 然后再将解析好的css执行style将样式通过style标签放到header里
                'css-loader',
                'sass-loader',
                {
                    loader: 'postcss-loader', // css后置处理配置
                    options: {
                        plugins: () => [
                            autoprefixer({ // webpack 自动补齐浏览器前缀
                                overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'], // 设置浏览器兼容版本 浏览器使用人数比例
                            }),
                        ],
                    },
                },
                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75, // rem相对px的单位 1rem=75px
                        remPrecision: 8, // 转换成rem后小数点位数
                    },
                },
            ],
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext]',
                },
            },

        },
        {
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash:8].[ext]',
                },
            },
        },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ // css提取单独文件，并添加文件指纹
            filename: '[name]_[contenthash:8].css',
        }),
        new CleanWebpackPlugin(), // 清理构建目录产物
        new FriendlyErrorsWebpackPlugin(), // 处理构建提示
        function errorPlugin () { // 处理构建异常
            this.hooks.done.tap('done', (stats) => { // this代表compile webpack3 的话 写成 this.plugin()
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
                    console.log('build error'); //eslint-disable-line
                    process.exit(1); // 错误码处理
                    // 可以进行上报处理
                }
            });
        },
    ].concat(htmlWebpackPlugins),
    stats: 'errors-only',

};
