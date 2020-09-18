const { merge } = require('webpack-merge');
const { env, config } = require('../../../../webpack.common');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssNormalize = require('postcss-normalize');

let  _entry={};
_entry[env.project]= path.resolve(__dirname, '../src/index.tsx');
module.exports = merge(config, {
    entry: _entry,
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
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
                            sourceMap: true
                        }
                    },
                    'sass-loader',
                ]
            },
        ]
    },
    devServer: {
        contentBase: 'dist',
        overlay: true,  //浏览器显示错误
        noInfo: true,
        historyApiFallback:true,
        publicPath:'/',
        stats: 'errors-only', // 只有产生错误的时候，才显示错误信息，日志的输出等级是error.
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '../public/index.html'),
            chunks: [env.project, "common", "vendors", "manifest"],
            templateParameters: {
                'favicon': '/favicon.ico'
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../public'),
                    globOptions: {
                        ignore: ['**/index.html'],
                    },
                    to: path.join(__dirname, '../../../../dist'),
                }
            ]
        })
    ],
    output: {
        filename: '[name].[hash].js',
        publicPath:'/'
    },

})