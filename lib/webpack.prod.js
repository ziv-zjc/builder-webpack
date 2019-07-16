const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const prodConfig = {
    mode: 'production',
    plugins: [
        new OptimizeCssAssetsPlugin({ // css压缩 同时依赖 cssnano进行预处理
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano,
        }),
        // new HtmlWebpackExternalsPlugin({ // 提取公共资源
        //     externals: [{
        //         module: 'react',
        //         entry: '', // 本地路径 或者 cdn url
        //         global: 'React',
        //     },
        //     {
        //         module: 'react-dom',
        //         entry: '', // 本地路径 或者 cdn url
        //         global: 'ReactDOM',
        //     },
        //     ],
        // }),
    ],
    optimization: { // 提取公共部分
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                basisChunks: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all',
                },
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2,
                },
            },
        },
    },
};

module.exports = merge(baseConfig, prodConfig);
