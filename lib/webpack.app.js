module.exports = function (config, i18n) {

    const extractTextPlugin = require('extract-text-webpack-plugin'),
        extractTextWebpackPlugin = require('clean-webpack-plugin'),
        i18nPlugin = require('i18n-webpack-plugin'),
        webpack = require('webpack');

    const FONT_SIZE_LIMIT = 10000,
        IMG_SIZE_LIMIT = 8192;

    return Object.keys(i18n).map(function (lang) {
        let webpackConfig = {
            entry: config.entry,
            output: {
                path: config.dest.replace('[lang]', lang),
                filename: typeof config.entry === 'object' ? '[name].[hash].js' : 'app.[hash].js',
                publicPath: config.publicPath ? config.publicPath.replace('[lang]', lang) : './',
            },
            resolve: {
                symlinks: false
            },
            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: extractTextPlugin.extract({
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
                        use: extractTextPlugin.extract({
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
                    },
                    {
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
                        test: /\.(png|jpg|jpeg|gif)$/,
                        use: {
                            loader: 'url-loader',
                            options: {
                                limit: IMG_SIZE_LIMIT,
                            }
                        }
                    }, {
                        test: /\.js$/,
                        exclude: /node_modules\/(?!(([^\/]+?\/){1,2}(src|es6)))/,
                        use: {
                            loader: 'babel-loader',
                            options: {
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
                new i18nPlugin(i18n[lang], {nested: true}),
                new extractTextPlugin(typeof config.entry === 'object' ? '[name].[hash].css' : 'style.[hash].css'),
                new webpack.ProvidePlugin({
                    Promise: 'es6-promise-promise'
                })
            ]
        };

        if (Array.isArray(config.loaders)) {
            webpackConfig.module.rules = webpackConfig.module.loaders.concat(config.rules);
        }


        if (Array.isArray(config.plugins)) {
            webpackConfig.plugins = webpackConfig.plugins.concat(config.plugins);
        }

        config.pages.forEach(function (pageConfig) {
            webpackConfig.plugins.push(generatePages(pageConfig))
        });

        webpackConfig.plugins.push(new extractTextWebpackPlugin([webpackConfig.output.path], {
            dry: false,
            root: '/',
            verbose: true
        }));

        return webpackConfig;
    });
};


function generatePages(config) {
    const htmlWebpackPlugin = require('html-webpack-plugin'),
        templatePath = config.templatePath,
        output = config.output;

    return new htmlWebpackPlugin({
        chunks: config.chunks,
        chunksSortMode: _orderChunksByList(config.chunks),
        environment: {templateVar: config.templateVar},
        filename: output,
        template: templatePath,
        xhtml: true
    });

    function _orderChunksByList(chunkList) {
        return function (chunk1, chunk2) {
            let chunkIndex1 = chunkList.indexOf(chunk1.names[0]),
                chunkIndex2 = chunkList.indexOf(chunk2.names[0]);
            if (chunkIndex2 == -1 || chunkIndex1 < chunkIndex2) {
                return -1;
            } else if (chunkIndex1 == -1 || chunkIndex1 > chunkIndex2) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}


