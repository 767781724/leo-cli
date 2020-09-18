const { merge } = require('webpack-merge');
const {env,config} = require('../../../../webpack.common');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssNormalize = require('postcss-normalize');

const postcss= {
    loader: 'postcss-loader',
    options: {
        plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009',
                },
                stage: 3,
            }),
            postcssNormalize(),
        ],
        sourceMap: false
    }
};
let  _entry={};
_entry[env.project]= path.resolve(__dirname, '../src/index.tsx');

module.exports = merge(config, {
    entry: _entry,
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    postcss,
                    'css-loader',
                ]
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    postcss,
                    'sass-loader',

                ]
            },
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,//并行压缩
                extractComments: false,//移除注释
                uglifyOptions: {
                    compress: {
                        pure_funcs: ['console.log']
                    }
                }
            })
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "all",
                    minChunks: 2,
                    priority: 10,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    filename:env.project+'/js/vendors.[contenthash:8].js'
                }
            }
        }
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name]/css/bundle.[contenthash:8].css',
            chunkFilename: '[name]/css/[name].[contenthash:8].css',
        }),
        new HtmlWebpackPlugin({
            filename: path.join(env.project, '/index')+'.html',
            template: path.join(__dirname, '../public/index.html'),
            chunks: [env.project, "common", "vendors", "manifest"],
            templateParameters: {
                'favicon': env.APP_ENV === 'dev' ? path.join(env.project, '/favicon.ico') : "./favicon.ico"
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../public'),
                    globOptions: {
                        ignore: ['**/index.html'],
                    },
                    to: path.join(__dirname, '../../../../dist', env.project)
                }
            ]
        })
    ],
    output: {
        filename: '[name]/js/main.[contenthash:8].js',
        chunkFilename:'[name]/js/chunk.[contenthash:8].js',
        publicPath:'/'
    }
})