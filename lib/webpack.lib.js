'use strict';

module.exports = function (config) {
    const cleanWebpackPlugin = require('clean-webpack-plugin'),
        copyWebpackPlugin = require('copy-webpack-plugin'),
        extractTextWebpackPlugin = require('extract-text-webpack-plugin'),
        webpack = require('webpack');

    const FONT_SIZE_LIMIT = 10000,
        IMG_SIZE_LIMIT = 8192;

    const webpackConfig = {
        entry: config.entry ? config.entry : './src/entry.js',
        output: {
            path: `${process.cwd()}/dist`,
            filename: config.filename || '[name].js',
            library: '[name]',
            libraryTarget: 'umd'
        },
        resolve: {
            symlinks: false
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: extractTextWebpackPlugin.extract({
                        publicPath: './',
                        fallback: 'style-loader',
                        use: [{
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        }, {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }

                        }]
                    })
                }, {
                    test: /\.css/,
                    use: extractTextWebpackPlugin.extract({
                        publicPath: './',
                        fallback: 'style-loader',
                        use: {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    })
                }, {
                    test: /\.woff2$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: FONT_SIZE_LIMIT,
                            minetype: 'application/font-woff'
                        }
                    }
                }, {
                    test: /\.woff$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: FONT_SIZE_LIMIT,
                            minetype: 'application/font-woff'
                        }
                    }
                }, {
                    test: /\.ttf$/,
                    use: {
                        loader: 'file-loader'
                    }
                }, {
                    test: /\.eot$/,
                    use: {
                        loader: 'file-loader'
                    }
                }, {
                    test: /\.svg$/,
                    use: {
                        loader: 'file-loader'
                    }
                }, {
                    test: /\.(jpg|jpeg|png|gif)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: IMG_SIZE_LIMIT
                        }
                    }
                }, {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(([^\/]+?\/){1,2}(src|es6)))/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['transform-react-jsx', 'syntax-dynamic-import', 'syntax-async-functions', 'transform-regenerator'],
                            presets: [
                                [
                                    'es2015',
                                    {
                                        modules: false
                                    }
                                ]
                            ],
                            cacheDirectory: true
                        }
                    }
                }
            ]

        },
        plugins: [
            new extractTextWebpackPlugin('[name].css')
        ]
    };


    if (config.copy) {
        webpackConfig.plugins.push(new copyWebpackPlugin(config.copy));
    }

    if (Array.isArray(config.plugins)) {
        webpackConfig.plugins = webpackConfig.plugins.concat(config.plugins);
    }

    if (Array.isArray(config.rules)) {
        webpackConfig.module.rules = webpackConfig.module.rules.concat(config.rules);
    }

    webpackConfig.plugins.push(new cleanWebpackPlugin([webpackConfig.output.path], {
        dry: false,
        root: '/',
        verbose: true
    }));

    return webpackConfig;
};

